export interface CreateVendorInput{
    name: string;
    ownerName: string;
    foodType: string;
    pincode: string
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface EditVendorInput {
    name: string
    address: string
    phone: string
    foodTypes: [string]
}

export interface VendorLoginInputs {
    email: string;
    password: string;

}
export interface VendorPayload {
    _id: string;
    email: string
    name: string
    foodTypes: [string]

}

export interface CreateOfferInputs {

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