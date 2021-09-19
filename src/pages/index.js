import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
const searchTool = [
  {
    title: "google",
    uri: "https://google.com/search?q=",
    icon: "./assets/icons/google.png",
  },
  {
    title: "bing",
    uri: "https://www.bing.com/search?q=",
    icon: "./assets/icons/bing.png",
  },
  {
    title: "duckduckgo",
    uri: "https://duckduckgo.com/?q=",
    icon: "./assets/icons/duckduckgo.png",
  },
  {
    title: "stackoverflow",
    uri: "https://stackoverflow.com/search?q=",
    icon: "./assets/icons/stackoverflow.png",
  },
  {
    title: "coccoc",
    uri: "https://coccoc.com/search?query=",
    icon: "./assets/icons/coccoc.png",
  },
  {
    title: "ecosia",
    uri: "https://www.ecosia.org/search?q=",
    icon: "./assets/icons/ecosia.png",
  },
];
function Button({ title, uri, search, icon, setSearchContent }) {
  const onSearch = () => {
    window.open(`${uri}${search}`);
    // setSearchContent("");
  };
  return (
    <div onClick={onSearch} className="cursor-pointer">
      <img className="w-10 h-10" src={icon} alt="" />
    </div>
  );
}
function stripHtml(html) {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
export default function Home({ autoComplete }) {
  const [searchContent, setSearchContent] = useState("");
  const router = useRouter();
  const onSubmit = (e) => {
    e.preventDefault();
    window.open(`${searchTool[0].uri}${searchContent}`);
  };
  useEffect(() => {
    console.log(`autoComplete`, autoComplete.length == 0);
    if (searchContent) {
      router.push("/?q=" + searchContent);
    } else {
      router.push("/?q=");
    }
  }, [searchContent]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#E6E6EE]">
      <div className="w-full flex bg-[#F7F8FB] shadow-lg rounded-lg lg:w-3/4 p-5 flex-col">
        <div className="space-y-1">
          {autoComplete &&
            autoComplete.map((item, index) => (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setSearchContent(stripHtml(item[0]));
                }}
                key={index}
                dangerouslySetInnerHTML={{ __html: item[0] }}
              />
            ))}
          {/* 
          {
            autoComplete?.length===0 &&Array(10).fill(0).map((item, index) => (<div key={index}> </div>))
          } */}
        </div>
        <div className="rounded-full flex flex-row items-center space-x-2 bg-white shadow-lg w-full mb-3">
          <form className="flex flex-1" onSubmit={onSubmit}>
            <input
              className="bg-transparent text-4xl focus:outline-none h-24 w-full px-5 flex-1"
              type="text"
              placeholder="Search..."
              value={searchContent}
              onChange={(e) => setSearchContent(e.target.value)}
            />
          </form>
        </div>
        <div className="border-t-2 mt-3 flex flex-row justify-evenly">
          {searchTool.map((e) => (
            <Button
              key={e.title}
              icon={e.icon}
              title={e.title}
              uri={e.uri}
              search={searchContent}
              setSearchContent={setSearchContent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
function unicodeToChar(text) {
  return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
  });
}

export async function getServerSideProps(context) {
  const { query } = context;
  console.log(query);

  const data = await axios
    .get(
      encodeURI(
        `https://www.google.com/complete/search?q=${query.q}&client=gws-wiz&xssi=t`
      ),
      { responseType: "arraybuffer", reponseEncoding: "binary" }
    )
    .then((res) => unicodeToChar(res.data.toString("latin1")));

  console.log("data :>> ", data);

  var content = JSON.parse(data.slice(5, data.length));

  for (let i of content[0]) {
    console.log(unicodeToChar(i[0]));
  }
  return {
    props: {
      autoComplete: content[0],
    }, // will be passed to the page component as props
  };
}
