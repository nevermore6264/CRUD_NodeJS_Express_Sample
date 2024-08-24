const puppeteer = require("puppeteer");
const fs = require("fs");
const { stringify } = require("csv-stringify");

(async () => {
  // Mở trình duyệt mới bằng Puppeteer.
  const browser = await puppeteer.launch();
  // Mở một tab mới.
  const page = await browser.newPage();

  // Điều hướng đến URL của trang truyện cười.
  await page.goto("https://truyencuoihay.vn/");

  // Chờ cho đến khi phần tử xuất hiện trên trang để đảm bảo rằng trang đã tải hoàn toàn.
  await page.waitForSelector(".entry");

  // Trích xuất dữ liệu từ trang.
  const items = await page.evaluate(() => {
    const itemNodes = document.querySelectorAll(".entry");
    const itemList = [];

    itemNodes.forEach((node) => {
      // Lấy tiêu đề truyện cười.
      const titleElement = node.querySelector(".entry-title a");
      const title = titleElement ? titleElement.innerText.trim() : null;

      // Lấy nội dung truyện cười.
      const contentElement = node.querySelector(".entry-content p");
      const content = contentElement ? contentElement.innerText.trim() : null;

      // Chỉ đẩy vào mảng nếu tất cả các giá trị không null.
      if (title && content) {
        itemList.push({ title, content });
      }
    });

    return itemList;
  });

  console.log(items);

  // Đóng trình duyệt.
  await browser.close();

  // Lưu dữ liệu vào tệp CSV.
  await saveDataToCSV(items, "truyencuoi_data.csv");
})();

// Hàm để lưu dữ liệu vào file CSV.
async function saveDataToCSV(data, filename) {
  // Tạo luồng ghi vào tệp CSV.
  const writetabStream = fs.createWriteStream(filename);

  // Các cột (tiêu đề) trong file CSV.
  const columns = ["title", "content"];

  // Tạo một đối tượng stringifier để chuyển đổi dữ liệu thành CSV.
  const stringifier = stringify({
    header: true, // Bao gồm tiêu đề cột.
    columns: columns, // Các cột sẽ xuất hiện trong file CSV.
    delimiter: "|", // Sử dụng dấu '|' làm delimiter giữa các giá trị.
  });

  // Kết nối luồng stringifier với luồng ghi, để dữ liệu sẽ được ghi vào file CSV.
  stringifier.pipe(writetabStream);

  // Duyệt qua từng dòng dữ liệu (đối tượng) trong mảng 'data'.
  data.forEach((row) => {
    // Viết dòng dữ liệu vào stringifier.
    stringifier.write(row);
  });

  // Kết thúc luồng stringifier, hoàn tất quá trình ghi dữ liệu.
  stringifier.end();

  // Hiển thị thông báo hoàn thành.
  console.log(`Data saved to ${filename}`);
}
