const cron = require("node-cron");
const fs = require("fs");
const csv = require("csv-parser");
const storyService = require("../service/story.service"); // Sửa lại đường dẫn service

// Lên lịch cho các nhiệm vụ được thực thi trên máy chủ.
// Chạy nhiệm vụ mỗi 5 giây
cron.schedule("*/20 * * * * *", function () {
  console.log("running a task every 5 seconds");
  updateStories();
});

async function updateStories() {
  try {
    // Xóa dữ liệu trong bảng 'stories'
    await storyService.truncate(); // Gọi phương thức truncate trong storyService

    // Đọc file và thêm dữ liệu mới
    await readFile();
  } catch (error) {
    console.error("Error in updateStories:", error);
  }
}

function readFile() {
  fs.createReadStream("stories.csv")
    .pipe(
      csv({
        separator: "|", // Đặt delimiter là '|'
      })
    )
    .on("data", async (row) => {
      try {
        // Tạo story mới từ hàng trong file CSV
        const newStory = {
          title: row.title,
          content: row.content,
          publishedAt: row.publishedAt ? new Date(row.publishedAt) : null, // Chuyển đổi sang Date nếu có
          status: row.status, // Giả định file CSV có trường status
          authorId: parseInt(row.authorId, 10), // Giả định file CSV có trường authorId
          categoryId: parseInt(row.categoryId, 10), // Giả định file CSV có trường categoryId
        };

        // Sử dụng service để tạo truyện trong cơ sở dữ liệu
        await storyService.create(newStory);
        console.log(
          `Story "${newStory.title}" has been added to the database.`
        );
      } catch (error) {
        console.error("Error adding story to the database:", error);
      }
    })
    .on("end", () => {
      console.log("All data has been processed.");
    });
}
