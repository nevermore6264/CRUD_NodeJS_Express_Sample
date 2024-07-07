const puppeteer = require("puppeteer");
const fs = require("fs");
const { stringify } = require("csv-stringify");

(async () => {
  // Mở một phiên bản trình duyệt mới bằng Puppeteer.
  const browser = await puppeteer.launch();
  // Mở một tab mới
  const page = await browser.newPage();

  // Điều hướng tab vừa mở tới URL
  await page.goto("https://onewaymobile.vn/may-cu-pc118.html");

  // Chờ cho đến khi phần tử xuất hiện trên trang đảm bảo rằng trang đã tải hoàn toàn nội dung mà bạn muốn trích xuất.
  await page.waitForSelector(".productlist");

  // Trích xuất dữ liệu.
  const items = await page.evaluate(() => {
    const itemNodes = document.querySelectorAll(".tmpl-item-product");
    const itemList = [];

    itemNodes.forEach((node) => {
      // Lấy tên sản phẩm
      const nameElement = node.querySelector(".product-name");
      const name = nameElement ? nameElement.innerText.trim() : null;

      // Lấy giá sản phẩm
      const priceElement = node.querySelector(".price");
      const priceText = priceElement ? priceElement.innerText.trim() : null;
      const price = priceText
        ? parseFloat(priceText.replace(/[^0-9]/g, ""))
        : null;

      // Lấy mô tả sản phẩm
      const techElements = node.querySelectorAll(".product-tech span");
      const techDetails = Array.from(techElements).map((tech) =>
        tech.getAttribute("data-original-title")
      );
      const description =
        techDetails.length > 0 ? techDetails.join(", ") : null;

      // Đặt categoryId cứng vì thông tin này không có trên trang
      const categoryId = 1; // Bạn có thể thay đổi categoryId này theo ý muốn

      // Chỉ đẩy vào mảng nếu tất cả các giá trị không null
      if (name && price !== null && description !== null) {
        itemList.push({ name, price, description, categoryId });
      }
    });

    return itemList;
  });

  console.log(items);

  //Đóng trình duyệt
  await browser.close();

  await saveDataToCSV(items, "saved_from_db.csv");
})();

// Hàm để lưu dữ liệu vào file CSV
async function saveDataToCSV(data, filename) {
  // Tạo luồng ghi vào tệp CSV
  const writetabStream = fs.createWriteStream(filename);

  // Các cột (tiêu đề) trong file CSV
  const columns = ["name", "price", "description", "categoryId"];

  // Tạo một đối tượng stringifier để chuyển đổi dữ liệu thành CSV
  const stringifier = stringify({
    header: true, // Bao gồm tiêu đề cột
    columns: columns, // Các cột sẽ xuất hiện trong file CSV
    delimiter: "|", // Sử dụng dấu '|' làm delimiter giữa các giá trị
  });

  // Kết nối luồng stringifier với luồng ghi, để dữ liệu sẽ được ghi vào file CSV
  stringifier.pipe(writetabStream);

  // Duyệt qua từng dòng dữ liệu (đối tượng) trong mảng 'data'
  data.forEach((row) => {
    // Viết dòng dữ liệu vào stringifier
    stringifier.write(row);
  });

  // Kết thúc luồng stringifier, hoàn tất quá trình ghi dữ liệu
  stringifier.end();

  // Hiển thị thông báo hoàn thành
  console.log(`Data saved to ${filename}`);
}
