// src/services/CRUDService.ts
import { ModelStatic, FindOptions } from "sequelize";

export class CRUDService<T> {
  model: ModelStatic<any>;

  constructor(model: ModelStatic<any>) {
    this.model = model;
  }

  async create(data: any) {
    return await this.model.create(data);
  }

  async findAll(options?: FindOptions) {
    return await this.model.findAll(options);
  }

  async findOne(id: number) {
    return await this.model.findByPk(id);
  }

  async update(id: number, data: any) {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    return await instance.update(data);
  }

  async delete(id: number) {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    await instance.destroy();
    return true;
  }
}
