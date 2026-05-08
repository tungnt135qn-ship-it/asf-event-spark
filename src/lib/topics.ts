import t1 from "@/assets/topics/t1.jpg";
import t2 from "@/assets/topics/t2.jpg";
import t3 from "@/assets/topics/t3.jpg";
import t4 from "@/assets/topics/t4.jpg";
import t5 from "@/assets/topics/t5.jpg";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "img"; src: string; caption?: string }
  | { type: "quote"; text: string; author?: string };

export type Topic = {
  slug: string;
  title: string;
  desc: string;
  image: string;
  longDescription: string;
  highlights: string[];
  documents: { name: string; size: string }[];
  content: ContentBlock[];
};

export const topics: Topic[] = [
  {
    slug: "asian-equity-outlook",
    title: "Recent Developments and Outlook for Asian Equity Markets",
    desc: "Cập nhật xu hướng và triển vọng thị trường cổ phiếu khu vực Châu Á.",
    image: t1,
    longDescription:
      "Phiên thảo luận đầu tiên của ASF 2026 đánh giá toàn cảnh thị trường cổ phiếu Châu Á, các nhân tố vĩ mô, dòng vốn và yếu tố chính sách định hình triển vọng giai đoạn tới.",
    highlights: [
      "Cập nhật xu hướng phát triển thị trường cổ phiếu khu vực",
      "Đánh giá triển vọng tăng trưởng và dòng vốn",
      "Tác động của chính sách tiền tệ, địa chính trị và công nghệ",
    ],
    documents: [{ name: "Asian Equity Outlook 2026.pdf", size: "2.1 MB" }],
    content: [
      { type: "p", text: "Sau giai đoạn phân hoá chính sách giữa các ngân hàng trung ương lớn, thị trường cổ phiếu Châu Á bước vào năm 2026 với kỳ vọng dòng vốn quay trở lại các thị trường mới nổi." },
      { type: "img", src: t1 },
      { type: "h", text: "Các yếu tố trọng yếu" },
      { type: "p", text: "Phiên sẽ phân tích vai trò của chính sách tiền tệ Mỹ – Trung, căng thẳng địa chính trị khu vực và tác động của AI/Cloud lên định giá doanh nghiệp niêm yết." },
    ],
  },
  {
    slug: "asian-bond-markets",
    title: "Development of Asian Bond Markets",
    desc: "Thực trạng, minh bạch, thanh khoản và vai trò của trái phiếu trong ổn định tài chính khu vực.",
    image: t2,
    longDescription: "Phiên thảo luận về sự phát triển của thị trường trái phiếu Châu Á — trục xương sống của hệ thống tài chính khu vực.",
    highlights: [
      "Thực trạng và xu hướng phát triển thị trường trái phiếu",
      "Tăng cường minh bạch, thanh khoản và chuẩn hoá",
      "Vai trò của trái phiếu trong ổn định tài chính khu vực",
    ],
    documents: [{ name: "Asia Bond Market Outlook 2026.pdf", size: "3.2 MB" }],
    content: [
      { type: "p", text: "Thị trường trái phiếu ASEAN+3 dự kiến tiếp tục mở rộng quy mô phát hành sơ cấp trong 2026, với trọng tâm là chuẩn hoá thông tin và phát triển hạ tầng giao dịch." },
      { type: "img", src: t2 },
      { type: "h", text: "Trọng tâm phiên thảo luận" },
      { type: "p", text: "Các diễn giả sẽ bàn về cải thiện thanh khoản thứ cấp, hài hoà chuẩn mực ASEAN, và vai trò trái phiếu trong neo giữ kỳ vọng lạm phát khu vực." },
    ],
  },
  {
    slug: "digital-ai-capital-markets",
    title: "Digitalization, Online Trading and AI: Transforming Capital Markets",
    desc: "Số hoá giao dịch, ứng dụng AI và chuyển đổi số trên thị trường vốn Châu Á.",
    image: t3,
    longDescription: "Phiên thảo luận thứ ba của ASF 2026 tập trung vào các công nghệ đang định hình lại cách vận hành thị trường vốn — từ giao dịch điện tử đến AI và phân tích dữ liệu lớn.",
    highlights: [
      "Ứng dụng công nghệ số trong giao dịch chứng khoán",
      "Vai trò của AI trong phân tích đầu tư và quản trị rủi ro",
      "Xu hướng chuyển đổi số trong thị trường vốn",
    ],
    documents: [{ name: "Digital & AI in Capital Markets.pdf", size: "1.9 MB" }],
    content: [
      { type: "p", text: "Tốc độ áp dụng AI trong các tổ chức tài chính Châu Á đang tăng nhanh, từ phân tích tín dụng đến giám sát giao dịch và tư vấn đầu tư cá nhân hoá." },
      { type: "img", src: t3 },
      { type: "h", text: "Cơ hội và rủi ro" },
      { type: "p", text: "Phiên sẽ thảo luận khung quản trị AI, tiêu chuẩn dữ liệu và yêu cầu hạ tầng để các thị trường mới nổi tận dụng được làn sóng số hoá." },
    ],
  },
  {
    slug: "vietnam-new-era",
    title: "Thị trường Chứng khoán Việt Nam — Kỷ nguyên mới",
    desc: "Hội thảo chuyên đề Việt Nam: chiến lược vốn, hạ tầng, kinh tế tư nhân và đối thoại nhà đầu tư.",
    image: t4,
    longDescription: "Phiên đặc biệt do phía Việt Nam đề xuất trong khuôn khổ ASF 2026 — hướng tới mục tiêu thu hút dòng vốn quốc tế và nâng cao vị thế thị trường tài chính Việt Nam.",
    highlights: [
      "Chiến lược phát triển vốn equity và debt của Chính phủ Việt Nam",
      "Nhu cầu vốn cho hạ tầng và chính sách thu hút vốn ngoại",
      "Chính sách thúc đẩy kinh tế tư nhân; vai trò của thị trường vốn",
      "Sức hấp dẫn của cổ phiếu và trái phiếu Việt Nam dưới góc nhìn nhà đầu tư khu vực",
      "Đối thoại Nhà đầu tư quốc tế — Cơ quan quản lý — Doanh nghiệp Việt Nam",
    ],
    documents: [
      { name: "Vietnam Capital Markets — New Era Briefing.pdf", size: "2.7 MB" },
      { name: "Vietnam Infrastructure Financing Roadmap.pdf", size: "1.6 MB" },
    ],
    content: [
      { type: "p", text: "Việt Nam đang ở giai đoạn chuyển mình mạnh mẽ về kinh tế và thể chế, với hàng loạt cải cách hướng tới nâng hạng thị trường chứng khoán và mở rộng kênh dẫn vốn dài hạn." },
      { type: "img", src: t4 },
      { type: "h", text: "Năm trục nội dung chính" },
      { type: "p", text: "1) Chiến lược phát triển vốn chủ sở hữu và vốn vay của Chính phủ Việt Nam trong kỷ nguyên vươn mình. 2) Nhu cầu vốn của nền kinh tế đối với xây dựng hạ tầng; thay đổi chính sách để thu hút vốn ngoại. 3) Chính sách thúc đẩy kinh tế tư nhân — thành tựu, triển vọng và vai trò của thị trường vốn. 4) Sức hấp dẫn của cổ phiếu và trái phiếu Việt Nam: điểm sáng và vấn đề cần giải quyết. 5) Đối thoại trực tiếp giữa nhà đầu tư quốc tế, cơ quan quản lý và doanh nghiệp Việt Nam." },
      { type: "quote", text: "Nâng hạng thị trường chứng khoán không phải là đích đến, mà là khởi đầu cho một kỷ nguyên mới của thị trường vốn Việt Nam.", author: "Lãnh đạo VBMA" },
    ],
  },
];


export function getTopic(slug: string) {
  return topics.find((t) => t.slug === slug);
}
