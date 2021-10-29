import mongoose, { Schema, Document } from 'mongoose'

export interface OfferDoc extends Document {

    offerType: string; //   Vendor  //  Generic
    vendors: [any] //   ['2349424383']
    title: string //    Get 10% Off
    description: string //  any description with terms and conditions
    minValue: number // minimum order amount
    offerAmount: number //  200
    startValidity: Date 
    endValidity: Date
    promocode: string   //  WEEK200
    promoType: string   //  USER / ALL / BANK / CARD
    bank: [any]
    bins: [any]
    pincode: string
    isActive: boolean
}

const OfferSchema = new Schema({

    offerType: { type: String, required: true},//   Vendor  //  Generic
    vendors: [
        {
            type: Schema.Types.ObjectId, ref: 'vendor'
        }
    ], //   ['2349424383']
    title: { type: String, required: true},  //    Get 10% Off
    description: String , //  any description with terms and conditions
    minValue: Number, // minimum order amount
    offerAmount: { type: Number, required: true} ,//  200
    startValidity: Date ,
    endValidity: Date,
    promocode: { type: String, required: true} ,   //  WEEK200
    promoType: { type: String, required: true} ,   //  USER / ALL / BANK / CARD
    bank: [
        { type: String}
    ],
    bins: [{
        type: Number
    }],
    pincode: { type: Number, required: true},
    isActive: Boolean,
   
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
        }
    },
    timestamps:true
})

const Offer = mongoose.model<OfferDoc>('offer', OfferSchema)

export { Offer }