import mongoose from "mongoose";
// model은 document 이름이자 실제 data이고 schema는 형태를 의미한다.

const VideoSchema = new mongoose.Schema({
  fileUrl: {
    // 영상 파일 자체를 Database에 저장하면 너무 무거워지므로 Url을 참조하는 방식을 사용. 영상의 주소를 저장.
    type: String,
    required: "File URL is required" // fileUrl 값이 없으면 이 "File URL is required"를 값으로 취한다.
  },
  title: {
    type: String,
    required: "Title is required"
  },
  description: String,
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 위에서 작성한 Schema를 통해 Model 작성

const model = mongoose.model("Video", VideoSchema);
export default model;
// 여기까지 작성하면 Database와 연결은 되어있지만 거기에 model이 있다는 것은 DB가 인지 못하는 상태.
