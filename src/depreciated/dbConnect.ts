import mongoose from "mongoose";

type ConnectOptions = {
    isConnected?: number
}

const connection: ConnectOptions = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already Connected to DB");
        return ;
    }
    else {
        try {
            const db = await mongoose.connect(process.env.DB_URL || "")

            connection.isConnected = db.connections[0].readyState
        
            console.log("Connected to DB Successfully");
        } catch (error){
            console.log("Error Connecting to DB: ", error);

            process.exit(1);
        }
    }
}


/*
* @deprecated
*/
export default dbConnect;