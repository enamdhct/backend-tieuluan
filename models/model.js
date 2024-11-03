const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    }, 
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    demand: {
        type: String,
    },
    guarantee: {
        type: String
    },
    specialTreatment:{
        type: String,
    },
    imgURL: {
        type: String,
    },
    categoryID: {
        type: String,
    },
    vendorID: {
        type: String,
    },
    isActive: {
        type: String
    },
    isBestSaler: {
        type: String
    },
    description1: {
        type: String
    },
    description2: {
        type: String
    },
    productDetail: {
        core: {
            type: String
        },
        flow: {
            type: String
        },
        memory: {
            type: String
        },
        source: {
            type: String
        },
        dimension: {
            type: String
        },
        speed: {
            type: String
        },
        graphicsChip: {
            type: String
        },
        genergation: {
            type: String
        },
        bus: {
            type: String
        },
        read: {
            type: String
        },
        write: {
            type: String
        },
        capacity: {
            type: String
        },
        connect: {
            type: String
        }
    }
}, { timestamps: true })

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    link: {
        type: String,
    },
    location: {
        type: String
    },
    email: {
        type: String
    },
    logo: {
        type: String
    },
    phone: {
        type: String
    },
    isActive: {
        type: String
    }  
}, { timestamps: true })

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    imgCategory: {
        type: String
    },
    detail: {
        type: String
    },
    isActive: {
        type: String
    }  
}, { timestamps: true })

const shipSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    time: {
        type: String,
    },
    isActive: {
        type: String
    }  
}, { timestamps: true })

const cartSchema = new mongoose.Schema({
    productID: {
        type: String,
    },
    userID: {
        type: String,
    },
    quantity: {
        type: String,
    },
    state: {
        type: String
    }
}, { timestamps: true })

const productCartSchema = new mongoose.Schema({
    productID: {
        type: String,
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number, 
    },
    totalPrice: {
        type: Number, 
    },
    name: {
        type: String
    },
    imgProduct: {
        type: String
    }
}, {_id: false})

const orderSchema = new mongoose.Schema({
    product: [productCartSchema],
    state: {
        type: String
    },
    deliveryTime: {
        type: Date
    },
    orderTime: {
        type: Date
    },
    shippingAddress: {
        type: String
    },
    shippingFee: {
        type: Number
    },
    Price: {
        type: Number
    },
    paymentMethod: {
        type: String
    },
    userID: {
        type: String
    },
    note: {
        type: String
    },
    isReview: {
        type: String
    },
    voucherPrice: {
        type: Number
    },
    voucherId:{
        type: String
    },
    coinApply:{
        type: Number
    }

}, { timestamps: true })

const paymentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    yc: {
        type: String,
    },
    stk: {
        type: String,
    },
}, { timestamps: true })

const personalDataSchema = new mongoose.Schema({
    stk: {
        type: String
    },
    personSTK: {
        type: String
    },
    bank: {
        type: String
    },
    cccd: {
        type: String
    },
    cccdDate: {
        type: String
    },
    cccdPlace: {
        type: String
    },
    resident:{
        type: String
    },
    nation: {
        type: String
    },
    religion: {
        type: String
    },
    marriage: {
        type: String
    }
}, {timestamps: true})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    gender: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    birthday: {
        type: String,
    },
    avatarURL: {
        type: String
    },
    coin: {
        type: Number
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    person: {
        type: personalDataSchema,
        default: {}
    },
    role: {
        type: String
    }
}, { timestamps: true })

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    gender: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
    }
}, { timestamps: true })

const chatSchema = new mongoose.Schema({
    question: {
        type: String,
    },
    reply: {
        type: String,
    },
    userID: {
        type: String,
    }
}, { timestamps: true })

const reCommentSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    userID: {
        type: String
    },
    userInfo: {
        name: {
            type: String
        },
        avatarURL: {
            type: String
        },
        role: {
            type: String
        }
    }
}, {timestamps: true})

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    userID: {
        type: String
    },
    productID: {
        type: String
    },
    rate: {
        type: Number
    },
    userInfo: {
        name: {
            type: String
        },
        avatarURL: {
            type: String
        },
        role: {
            type: String
        }
    },
    replyComment: [reCommentSchema]
}, { timestamps: true })

const repCommentSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    commentID: {
        type: String
    },
    like: {
        type: Number
    },
    userID: {
        type: String
    },
    productID: {
        type: String
    }
}, { timestamps: true })

const logWareHouseSchema = new mongoose.Schema({
    userID: {
        type: String
    },
    user: {
        name: {type: String},
        avt: {type: String}
    },
    quantity: {
        type: Number, 
    },
    type: {
        type: String
    },
    note: {
        type: String
    }
}, {timestamps: true})

const warehouseSchema = new mongoose.Schema({
    productID: {
        type: String,
    },
    productName: {
        type: String
    },
    productIMG: {
        type: String
    },
    quantity: {
        type: Number
    },
    log: [
        logWareHouseSchema
    ]
}, { timestamps: true })

const locationDeliverySchema = new mongoose.Schema({
    userID: {
        type: String,
    },
    customerName: {
        type: String
    },
    location: {
        type: String
    },
    districtID: {
        type: String
    },
    wardCode: {
        type: String
    },
    phone: {
        type: String
    },
    default: {
        type: Boolean
    }
}, { timestamps: true })

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    orderID: {
        type: String
    },
    rate: {
        type: Number
    },
    user: {
        name: {type: String},
        avt: {type: String}
    }
}, { timestamps: true })

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    content:{
        type: String
    },
    state: {
        type: String
    }
}, { timestamps: true })

const productDetailSchema = new mongoose.Schema({
    productId: {
        type: String
    },
    core: {
        type: String
    },
    flow: {
        type: String
    },
    memory: {
        type: String
    },
    source: {
        type: String
    },
    dimension: {
        type: String
    },
    speed: {
        type: String
    },
    graphicsChip: {
        type: String
    },
    genergation: {
        type: String
    },
    bus: {
        type: String
    },
    read: {
        type: String
    },
    write: {
        type: String
    },
    capacity: {
        type: String
    },
    connect: {
        type: String
    }
})
const productPriceSchema = new mongoose.Schema({
    productID: {
        type: String
    },
    price: {
        type: String
    },
    name: {
        type: String
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    isActive: {
        type: String
    }
})
// const requestBuildSchema = new mongoose.Schema({
//     product: [productCartSchema],
//     state: {
//         type: String
//     },
//     userID: {
//         type: String
//     },
//     name: {
//         type: String    
//     },
//     avatarURL: {
//         type: String
//     }
// })
const requestBuildSchema = new mongoose.Schema({
    // product: [productCartSchema],
    product: {
        cpu: productCartSchema,
        gpu: productCartSchema,
        disk: productCartSchema,
        main: productCartSchema,
        ram: productCartSchema,
        source: productCartSchema
    },
    state: {
        type: String
    },
    userID: {
        type: String
    },
    name: {
        type: String    
    },
    avatarURL: {
        type: String
    }, 
    phone: {
        type: String
    },
    email: {
        type: String
    },
    orderID: {
        type: String
    }
})

const vouchers = new mongoose.Schema({
    name: {
        type: String,
    },
    number: {
        type: String
    },
    percent: {
        type: Number
    },
    fixed: {
        type: Number
    },
    minimumPrice:{
        type: Number
    },
    isActive: {
        type: String
    }    
}, { timestamps: true })
const userVoucher = new mongoose.Schema({
    user_id: {
        type: String,
    },
    voucher_id: {
        type: String
    },
    is_use: {
        type: Boolean
    }
}, { timestamps: true })

const refundRequest = new mongoose.Schema({
    user_id: {
        type: String,
    },
    order_id: {
        type: String
    },
    request_date: {
        type: Date
    },
    refund_amount: {
        type: Number
    },
    status: {
        type: String
    },
    reason: {
        type: String
    },
    image: {
        type: String
    },
    proccessed_by:{
        type: String
    },
    proccessed_date:{
        type: Date
    }
}, { timestamps: true })
let RefundRequest = mongoose.model("RefundRequest", refundRequest);

let Voucher = mongoose.model("Voucher", vouchers);
let UserVoucher = mongoose.model("UserVoucher", userVoucher);
let Product = mongoose.model("Product", productSchema);
let Category = mongoose.model("Category", categorySchema);
let Vendor = mongoose.model("Vendor", vendorSchema);
let Ship = mongoose.model("Ship", shipSchema);
let Cart = mongoose.model("Cart", cartSchema);
let Order = mongoose.model("Order", orderSchema);
let Payment = mongoose.model("Payment", paymentSchema);
let User = mongoose.model("User", userSchema);
let Customer = mongoose.model("Member", customerSchema);
let Chat = mongoose.model("Chat", chatSchema);
let Comment = mongoose.model("Comment", commentSchema);
let RepComment = mongoose.model("RepComment", repCommentSchema);
let Warehouse = mongoose.model("Warehouse", warehouseSchema);
let LocationDelivery = mongoose.model("LocationDelivery", locationDeliverySchema);
let Review = mongoose.model("Review", reviewSchema);
let Contact = mongoose.model("Contact", contactSchema);
let ProductDetail = mongoose.model("ProductDetail", productDetailSchema);
let ProductPrice = mongoose.model("ProductPrice", productPriceSchema);
let RequestBuild = mongoose.model("RequestBuild", requestBuildSchema);

module.exports = {
    Product,
    Category,
    Vendor,
    Ship,
    Cart, 
    Order,
    Payment,
    User,
    Customer,
    Chat,
    Comment,
    RepComment,
    Warehouse,
    LocationDelivery,
    Review, 
    Contact,
    ProductDetail,
    ProductPrice,
    RequestBuild,
    Voucher,
    UserVoucher,
    RefundRequest
};
