import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderID: string, // 5948764
  vendorId: string,
  transactionId: string
  items: [any], //  [{ food, unit: 1}]
  totalAmount: number, //456
  paidAmount: number,
  orderDate: Date,
  orderStatus: string, // To determine the current status // waiting // FAILED  //  ACCEPT // REJECT  //  UNDER-PROCESS //  READY
  remarks: string,
  deliveryId: string,
  readyTime: number; //max 60 minutes
}

const OrderSchema = new Schema(
  {
    orderID: { type: String, required: true },
    vendorId: { type: String, required: true},
    transactionId: { type: String, required: true},
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    orderDate: { type: Date },
    orderStatus: { type: String },
    remarks: { type: String},
    deliveryId: { type: String},
    readyTime: {type: Number} //max 60 minutes
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("order", OrderSchema);

export { Order };
