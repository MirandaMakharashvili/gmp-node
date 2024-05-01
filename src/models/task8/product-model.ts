import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
    id: string;
    title: string;
    description: string;
    price: number;
}

const ProductSchema = new Schema<IProduct>({
    id: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return v.match(
                    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i,
                );
            },
            message: (props) => `${props.value} is not a valid UUID v4!`,
        },
    },
    title: String,
    description: String,
    price: Number,
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export { IProduct, Product };
