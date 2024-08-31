import mongoose, { Schema } from "mongoose";
import { NextResponse } from "next/server";

// สร้างลักษณะข้อมูลที่จะเก็บในฐานข้อมูล หรือ Schema
const dataSchema = new Schema({ Title: String, Platform: String, Genre: String, ImageURL: String, GameURL: String })

// ประกาศ Model เพื่อใช้อ้างอิงในการจัดการข้อมูลในฐานข้อมูล MongoDB
let Data
try {
  Data = mongoose.model("Game", dataSchema) // สร้าง Collection ชื่อ Game ไว้เก็บ Schema เพื่อมาอ้างอิง Model
} catch {
  Data = mongoose.model("Game") // หากในฐานข้อมูล MongoDB มี Collection ชื่อ Game กับ Schema อยู่แล้ว ให้อิงแค่ Collection พอ
}

// ฟังชันเชื่อมต่อฐานข้อมูล MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI) // ระบุ URL ของฐานข้อมูลใน MongoDB เรียกจากไฟล์ .env ที่ประกาศไว้
    console.log("เชื่อมต่อ MongoDB แล้ว")
  } catch (error) {
    console.log("ไม่สามารถเชื่อมต่อ MongoDB",error)
  }
}

// ฟังชัน Method POST เพื่อเพิ่มข้อมูลผ่าน API
export async function POST(request) {
  const { Title, Platform, Genre, ImageURL, GameURL } = await request.json() // ข้อมูลที่ผู้ส่ง ส่งมาผ่าน API จะนำมาแยกตามลักษณะ Schema ที่กำหนดไว้
  await connectMongoDB() // เรียกฟังชันเชื่อมต่อฐานข้อมูล
  await Data.create({ Title, Platform, Genre, ImageURL, GameURL }) // เพิ่มข้อมูลลงฐานข้อมูล
  return NextResponse.json({ message: "เพิ่มข้อมูลแล้ว" }, { status: 201 }) // ตอบกลับผู้ส่งผ่าน API เป็นข้อความและ HTTP Status Code ว่าสำเร็จ

}

// ฟังชัน Method GET เพื่อหาข้อมูลทั้งหมดผ่าน API
export async function GET() {
  await connectMongoDB() 
  const data = await Data.find() // หาข้อมูลทั้งหมดจากฐานข้อมูล
  return NextResponse.json(data, { message: "พบข้อมูลแล้ว" }, { status: 200 })
}

// ฟังชัน Method PUT เพื่อเปลี่ยนแปลงข้อมูลผ่าน API
export async function PUT(request) {
  const id  = request.nextUrl.searchParams.get("id") 
  const { Title,  Platform,  Genre,  ImageURL,  GameURL } = await request.json()
  await connectMongoDB()
  await Data.findByIdAndUpdate(id, { Title, Platform, Genre, ImageURL, GameURL })
  return NextResponse.json({ message: "เปลี่ยนแปลงข้อมูลแล้ว" }, { status: 200 })
}

// ฟังชัน Method DELETE ลบข้อมูลผ่าน API
export async function DELETE(request) {
  const id  = request.nextUrl.searchParams.get("id")
  await connectMongoDB()
  await Data.findByIdAndDelete(id)
  return NextResponse.json({ message: "ลบข้อมูลแล้ว" }, { status: 200 })
}