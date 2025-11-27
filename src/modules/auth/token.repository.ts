import { BaseRepository, Token } from "../../DB";
import { AppDataSource } from "../../DB/data-source";

class TokenRepository extends BaseRepository<Token> {
  constructor() {
    super(AppDataSource.getRepository(Token));
  }

  async findByJti(jti: string): Promise<Token | null> {
    return this.repo.findOne({ where: { jti } });
  }

  async isJtiBlacklisted(jti: string): Promise<boolean> {
    const blacklisted = await this.findByJti(jti);
    return !!blacklisted;
  }

  async cleanupExpired(): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .delete()
      .where("expiredAt < :now", { now: new Date() })
      .execute();
  }
}

export const tokenRepository = new TokenRepository();
