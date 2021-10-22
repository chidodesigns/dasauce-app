import express from 'express'
import mongoose from 'mongoose'
import { MONGO_URI } from './config';
import {AdminRoute, VendorRoute} from './routes'

const app = express()

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/admin', AdminRoute)
app.use('/vendor', VendorRoute)

mongoose.connect(MONGO_URI).then(result => {
  console.log("MongoDb Connected...")
}).catch(err  => console.log('error' + err))

app.listen(8000, () => {
    console.clear()
    console.log("App is listening to the port 8000")
})