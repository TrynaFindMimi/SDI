import { ImportTimelineModel, ITimelineEvent } from '../../infrastructure/persistence/mongodb/models/ImportTimeline';

export class TimelineService {
  async addEvent(
    importId: string,
    event: Omit<ITimelineEvent, 'id' | 'timestamp'>
  ): Promise<void> {
    const timelineEvent: ITimelineEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    await ImportTimelineModel.findOneAndUpdate(
      { importId },
      {
        $push: { events: timelineEvent },
        $setOnInsert: { importId, createdAt: new Date() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true, new: true }
    );
  }

  async getTimeline(importId: string): Promise<ITimelineEvent[]> {
    const timeline = await ImportTimelineModel.findOne({ importId });
    if (!timeline) return [];
    return timeline.events.sort((a: ITimelineEvent, b: ITimelineEvent) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createImportEvent(
    importId: string,
    importNumber: string,
    userId: string,
    userName: string
  ): Promise<void> {
    await this.addEvent(importId, {
      type: 'created',
      title: 'Importación creada',
      description: `Se creó la importación ${importNumber}`,
      userId,
      userName,
      metadata: { importNumber }
    });
  }

  async statusChangeEvent(
    importId: string,
    oldStatus: string,
    newStatus: string,
    userId: string,
    userName: string
  ): Promise<void> {
    await this.addEvent(importId, {
      type: 'status_change',
      title: 'Estado actualizado',
      description: `El estado cambió de "${oldStatus}" a "${newStatus}"`,
      userId,
      userName,
      metadata: { oldStatus, newStatus }
    });
  }

  async productAddedEvent(
    importId: string,
    productName: string,
    quantity: number,
    userId: string,
    userName: string
  ): Promise<void> {
    await this.addEvent(importId, {
      type: 'product_added',
      title: 'Producto agregado',
      description: `Se agregó "${productName}" (x${quantity})`,
      userId,
      userName,
      metadata: { productName, quantity }
    });
  }

  async costAddedEvent(
    importId: string,
    concept: string,
    amount: number,
    userId: string,
    userName: string
  ): Promise<void> {
    await this.addEvent(importId, {
      type: 'cost_added',
      title: 'Costo registrado',
      description: `Se registró el costo "${concept}" por $${amount.toFixed(2)}`,
      userId,
      userName,
      metadata: { concept, amount }
    });
  }

  async costsAllocatedEvent(
    importId: string,
    totalCosts: number,
    userId: string,
    userName: string
  ): Promise<void> {
    await this.addEvent(importId, {
      type: 'costs_allocated',
      title: 'Costos distribuidos',
      description: `Se distribuyeron $${totalCosts.toFixed(2)} entre los productos`,
      userId,
      userName,
      metadata: { totalCosts }
    });
  }
}

export const timelineService = new TimelineService();
