const puppeteer = require("puppeteer");
const fs = require("fs");
const { stringify } = require("csv-stringify");

(async () => {
  // Mở trình duyệt mới bằng Puppeteer.
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const allStories = []; // Mảng để lưu trữ tất cả các truyện từ nhiều trang

  // Cào dữ liệu từ các trang 1 đến 10 (có thể điều chỉnh tùy ý)
  for (let pageNum = 1; pageNum <= 10; pageNum++) {
    // Điều hướng đến trang web với số trang thay đổi.
    await page.goto(`https://www.sachhayonline.com/truyen-cuoi/${pageNum}`);

    // Chờ phần tử chứa danh sách truyện cười tải.
    await page.waitForSelector("#content");

    // Lấy dữ liệu truyện cười từ trang hiện tại.
    const stories = await page.evaluate(() => {
      const storyNodes = document.querySelectorAll("#content .reading-white");
      const storyList = [];

      storyNodes.forEach((node) => {
        // Lấy tiêu đề truyện cười.
        const titleElement = node.querySelector("a");
        const title = titleElement ? titleElement.innerText.trim() : null;

        // Lấy liên kết truyện cười.
        const link = titleElement ? titleElement.href : null;

        // Lấy tất cả các thẻ <p> của truyện cười.
        const contentElements = node.querySelectorAll("p");
        const content = Array.from(contentElements)
          .map((p) => p.innerText.trim()) // Lấy nội dung từng thẻ <p> và loại bỏ khoảng trắng đầu/cuối.
          .join("\r\n"); // Nối tất cả nội dung lại thành một chuỗi.

        // Giả định thông tin bổ sung
        const publishedAt = new Date().toISOString(); // Chuyển ngày xuất bản thành chuỗi định dạng ISO
        const status = "Published"; // Giả định trạng thái là "Published"
        const authorId = 1; // Giả định ID tác giả là 1 (bạn cần điều chỉnh theo nhu cầu của bạn)
        const categoryId = 1; // Giả định ID thể loại là 1 (bạn cần điều chỉnh theo nhu cầu của bạn)

        // Chỉ đẩy vào mảng nếu tiêu đề và liên kết không null.
        if (title && link) {
          storyList.push({
            title,
            content,
            publishedAt,
            status,
            authorId,
            categoryId,
          });
        }
      });

      return storyList;
    });

    console.log(`Crawled ${stories.length} stories from page ${pageNum}`);
    allStories.push(...stories); // Thêm các truyện cười vào mảng tổng
  }

  // Đóng trình duyệt.
  await browser.close();

  // Lưu tất cả dữ liệu truyện cười vào tệp CSV.
  await saveDataToCSV(allStories, "stories.csv");
})();

// Hàm để lưu dữ liệu vào file CSV.
async function saveDataToCSV(data, filename) {
  // Tạo luồng ghi vào tệp CSV.
  const writetabStream = fs.createWriteStream(filename);

  // Các cột (tiêu đề) trong file CSV.
  const columns = [
    "title",
    "content",
    "publishedAt",
    "status",
    "authorId",
    "categoryId",
  ];

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
