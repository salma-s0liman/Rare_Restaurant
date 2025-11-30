import { Repository } from "typeorm";
import { Cart } from "../../../DB/entity/cart";
import { CartItem } from "../../../DB/entity/cartItems";
import { Address } from "../../../DB/entity/address";
import {
  BadRequestException,
  NotFoundException,
  ApplicationException,
} from "../../../common/utils/";
import { AppDataSource } from "../../../DB/data-source";
import { orderStatusEnum, paymentStatusEnum } from "../../../common/enums";
import { CreateOrderBodyDto, OrderSummaryDto, OrderDetailDto } from "../dtos";
import { OrderRepository } from "../repositories/order.repository";
import { OrderItemRepository } from "../repositories/orderItem.repository";
import { OrderStatusHistoryRepository } from "../repositories/orderStatusHistory.repository";

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private orderItemRepo: OrderItemRepository,
    private statusHistoryRepo: OrderStatusHistoryRepository,
    private cartRepo: Repository<Cart>,
    private addressRepo: Repository<Address>
  ) {}

  async createOrderFromCart(data: CreateOrderBodyDto, userId: string): Promise<OrderDetailDto> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.cartRepo.findOne({
        where: { id: data.cartId, user: { id: userId } },
        relations: ['cart_items', 'cart_items.menuItem', 'restaurant', 'user']
      });

      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      if (!cart.cart_items || cart.cart_items.length === 0) {
        throw new BadRequestException("Cart is empty");
      }

      const address = await this.addressRepo.findOne({
        where: { id: data.addressId, user: { id: userId } }
      });

      if (!address) {
        throw new NotFoundException("Address not found");
      }

      const orderNumber = await this.orderRepo.generateOrderNumber();
      const subtotal = cart.cart_items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0);
      const tax = subtotal * 0.1;
      const deliveryFee = 50;
      const totalAmount = subtotal + tax + deliveryFee;

      const orderData = {
        order_number: orderNumber,
        status: orderStatusEnum.placed,
        payment_status: paymentStatusEnum.pending,
        subtotal: subtotal,
        tax: tax,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        payment_method: data.paymentMethod,
        notes: data.notes,
        user: { id: userId },
        restaurant: { id: cart.restaurant.id },
        address: { id: address.id }
      };

      const order = await this.orderRepo.create(orderData);

      const orderItems = cart.cart_items.map(cartItem => ({
        order: order,
        menu_item: cartItem.menuItem,
        quantity: cartItem.quantity,
        price_at_order: cartItem.priceAtAdd,
        item_name_snapshot: cartItem.menuItem.name
      }));

      await this.orderItemRepo.createOrderItems(orderItems);

      await this.statusHistoryRepo.createStatusChange({
        orderId: order.id,
        newStatus: orderStatusEnum.placed,
        changedById: userId,
        note: "Order placed"
      });

      await queryRunner.manager.delete(CartItem, { cart: { id: cart.id } });
      await queryRunner.manager.delete(Cart, { id: cart.id });

      await queryRunner.commitTransaction();
      return await this.getOrderDetail(order.id);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new ApplicationException(`Failed to create order: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderDetail(orderId: string): Promise<OrderDetailDto> {
    const order = await this.orderRepo.findByIdWithRelations(orderId);
    
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax || 0),
      discount: Number(order.discount || 0),
      deliveryFee: Number(order.delivery_fee || 0),
      totalAmount: Number(order.total_amount),
      placedAt: order.placed_at!,
      paidAt: order.paid_at,
      paymentStatus: order.payment_status!,
      paymentMethod: order.payment_method!,
      notes: order.notes,
      customer: {
        id: order.user.id,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.email,
        phone: order.user.phone
      },
      restaurant: {
        id: order.restaurant.id,
        name: order.restaurant.name,
        phone: order.restaurant.phone,
        address: order.restaurant.address
      },
      address: {
        street: order.address?.street || "",
        city: order.address?.city || "",
        postalCode: order.address?.postal_code,
        country: order.address?.country || ""
      },
      items: order.items?.map(item => ({
        id: item.id,
        itemNameSnapshot: item.item_name_snapshot || "",
        quantity: item.quantity,
        priceAtOrder: Number(item.price_at_order),
        subtotal: Number(item.price_at_order) * item.quantity
      })) || [],
      statusHistory: order.statusHistory?.map(history => ({
        previousStatus: history.previous_status as orderStatusEnum,
        newStatus: history.new_status as orderStatusEnum,
        changedAt: history.created_at!,
        changedBy: history.changedBy ? `${history.changedBy.firstName} ${history.changedBy.lastName}` : undefined,
        notes: history.note
      })) || []
    };
  }

  async getUserOrders(userId: string): Promise<OrderSummaryDto[]> {
    const orders = await this.orderRepo.findByUserId(userId);
    
    return orders.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status!,
      totalAmount: Number(order.total_amount),
      placedAt: order.placed_at!,
      customer: {
        id: order.user.id,
        firstName: order.user.firstName,
        lastName: order.user.lastName
      },
      restaurant: {
        id: order.restaurant.id,
        name: order.restaurant.name
      },
      itemCount: order.items?.length || 0
    }));
  }

  async getRestaurantOrders(restaurantId: string): Promise<OrderSummaryDto[]> {
    const orders = await this.orderRepo.findByRestaurantId(restaurantId);
    
    return orders.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status!,
      totalAmount: Number(order.total_amount),
      placedAt: order.placed_at!,
      customer: {
        id: order.user.id,
        firstName: order.user.firstName,
        lastName: order.user.lastName
      },
      restaurant: {
        id: order.restaurant.id,
        name: order.restaurant.name
      },
      itemCount: order.items?.length || 0
    }));
  }

  async updateOrderStatus(
    orderId: string, 
    newStatus: orderStatusEnum, 
    changedById?: string, 
    note?: string
  ): Promise<OrderDetailDto> {
    const order = await this.orderRepo.findById(orderId);
    
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const previousStatus = order.status;
    
    await this.orderRepo.update(orderId, { status: newStatus });
    
    await this.statusHistoryRepo.createStatusChange({
      orderId,
      previousStatus,
      newStatus,
      changedById,
      note
    });

    return await this.getOrderDetail(orderId);
  }

  async verifyOrderOwnership(orderId: string, userId: string): Promise<boolean> {
    return await this.orderRepo.verifyOwnership(orderId, userId);
  }

  async getOrderByNumber(orderNumber: number): Promise<OrderDetailDto | null> {
    const order = await this.orderRepo.findByOrderNumber(orderNumber);
    
    if (!order) {
      return null;
    }

    return await this.getOrderDetail(order.id);
  }
}
