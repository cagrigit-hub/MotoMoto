import { KafkaConsumer, USER_CREATED, USER_EVENTS, USER_GROUP_ID } from "@cakitomakito/moto-moto-common";
import UserService from "../services/user-service";
import mongoose from "mongoose";

const consumer = new KafkaConsumer(USER_GROUP_ID, ["localhost:29092"]);

type User = {
    _id: string;
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    drivingLicence: string;
    isBlocked: boolean;
    isEmailVerified: boolean;
}


async function start_listeners(){
    await consumer.subscribe(USER_EVENTS, async (payload) => {
        // parse the payload
        const data = JSON.parse(payload.message.value!.toString());
        if(data.type === USER_CREATED){
            const user = data.data as User;
            const user_id = new mongoose.Types.ObjectId(user._id);
            const userx = await UserService.registerUser(user_id,user.username, user.email, user.password);
            console.log("user created", userx);
        }
    }, true)
}

async function start(){
    console.log("consumer started to listen to events")
    await consumer.connect();
    await start_listeners();
    await consumer.run();
    console.log("consumer started to listen to events")
}
// lets start the consumer waiting 2 seconds
setTimeout(start, 2000);

export {}