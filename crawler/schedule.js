const cron = require("node-cron");
const fs = require("fs");
const csv = require("csv-parser");
const productService = require("../service/product.service");

// Lên lịch cho các nhiệm vụ được thực thi trên máy chủ.
// Chạy nhiệm vụ mỗi 5 giây
cron.schedule("*/5 * * * * *", function () {
  console.log("running a task every 5 seconds");
  updateProducts();
});


async function updateProducts() {
    try {
      // Xóa dữ liệu trong bảng 'products'
      await productService.truncate();
  
      // Đọc file và thêm dữ liệu mới
      await readFile();
    } catch (error) {
      console.error("Error in updateProducts:", error);
    }
  }

function readFile() {
  fs.createReadStream("saved_from_db.csv")
    .pipe(
      csv({
        separator: "|", // Đặt delimiter là '|'
      })
    )
    .on("data", async (row) => {
        // console.log(row)
      try {
        // Tạo product mới từ hàng trong file CSV
        const newProduct = {
          name: row.name,
          price: parseFloat(row.price),
          description: row.description,
          categoryId: parseInt(row.categoryId, 10),
        };

        // Sử dụng service để tạo sản phẩm trong cơ sở dữ liệu
        await productService.create(newProduct);
        console.log(
          `Product "${newProduct.name}" has been added to the database.`
        );
      } catch (error) {
        console.error("Error adding product to the database:", error);
      }
    })
    .on("end", () => {
      console.log("All data has been processed.");
    });
}
