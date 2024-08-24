const puppeteer = require("puppeteer");
const fs = require("fs");
const { stringify } = require("csv-stringify");

(async () => {
  // Mở trình duyệt mới bằng Puppeteer.
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Điều hướng đến trang web.
  await page.goto("https://www.sachhayonline.com/truyen-cuoi");

  // Chờ phần tử chứa danh sách truyện cười tải.
  await page.waitForSelector(".content-list");

  // Lấy dữ liệu truyện cười.
  const stories = await page.evaluate(() => {
    const storyNodes = document.querySelectorAll(".content-list .story");
    const storyList = [];

    storyNodes.forEach((node) => {
      // Lấy tiêu đề truyện cười.
      const titleElement = node.querySelector(".content-item-title a");
      const title = titleElement ? titleElement.innerText.trim() : null;

      // Lấy liên kết truyện cười.
      const link = titleElement ? titleElement.href : null;

      // Lấy mô tả ngắn của truyện cười.
      const descriptionElement = node.querySelector(".content-item-summary");
      const description = descriptionElement
        ? descriptionElement.innerText.trim()
        : null;

      // Chỉ đẩy vào mảng nếu tiêu đề và liên kết không null.
      if (title && link) {
        storyList.push({ title, link, description });
      }
    });

    return storyList;
  });

  console.log(stories);

  // Đóng trình duyệt.
  await browser.close();

  // Lưu dữ liệu vào tệp CSV.
  await saveDataToCSV(stories, "stories.csv");
})();

// Hàm để lưu dữ liệu vào file CSV.
async function saveDataToCSV(data, filename) {
  // Tạo luồng ghi vào tệp CSV.
  const writetabStream = fs.createWriteStream(filename);

  // Các cột (tiêu đề) trong file CSV.
  const columns = ["title", "link", "description"];

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
