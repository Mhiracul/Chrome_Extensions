import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiCopy } from "react-icons/fi";
import { AiOutlinePauseCircle, AiOutlinePlayCircle } from "react-icons/ai";

import { FaFacebook, FaTelegram, FaWhatsapp } from "react-icons/fa";
import Availabilty from "../components/Availabilty";
import { BiSolidVolumeFull, BiVolumeFull, BiVolumeMute } from "react-icons/bi";
const VideoPage = () => {
  const [videoURL, setVideoURL] = useState("");

  useEffect(() => {
    // Parse the query parameters to get the videoURL
    const queryParams = new URLSearchParams(window.location.search);
    const videoURLParam = queryParams.get("videoURL");

    // Set the videoURL in the state
    setVideoURL(videoURLParam);
  }, []);

  const toggleVolume = (videoId) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) => {
        if (video._id === videoId) {
          return {
            ...video,
            muted: !video.muted,
          };
        }
        return video;
      })
    );
  };

  // Function to toggle play/pause of a video
  const togglePlay = (videoId) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) => {
        if (video._id === videoId) {
          const videoElement = document.getElementById(`video-${video._id}`);
          if (videoElement) {
            if (videoElement.paused) {
              videoElement.play();
            } else {
              videoElement.pause();
            }
          }
          return video;
        }
        return video;
      })
    );
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full  font-sora">
        <div className=" container flex md:flex-row  flex-col justify-between  mx-auto px-4 sm:px-6 md:px-8 py-10">
          <div className="w-full">
            <h1 className="text-4xl text-[#141414] font-semibold mb-4 font-sora ">
              Your Video is ready!
            </h1>

            <div className="flex flex-col gap-10 mt-8">
              <div>
                <p className="text-[#727272] text-xs font-medium mb-2">Name</p>
                <h1 className="text-xl">Video Name</h1>
              </div>

              <div className="bg-[#f3f2f2]  px-3 py-2 rounded-md max-w-md flex items-center justify-between">
                <input
                  type="text"
                  placeholder="enter email of receiver"
                  className="text-xs bg-transparent outline-none"
                />
                <button className="bg-[#605C84] rounded-md text-sm text-white py-1 px-3">
                  Send
                </button>
              </div>

              <div className="bg-[#f3f2f2]  px-3 py-2 rounded-md max-w-md flex items-center justify-between">
                <input
                  type="text"
                  placeholder="https://www.helpmeout/Untitled_Video_20232509"
                  className="text-[10px] bg-transparent outline-none w-full"
                />
                <button className="bg-transparent border border-[#929292] inline-flex gap-2 items-center text-xs rounded-md   py-2 px-4">
                  <FiCopy color="#000" /> Copy
                </button>
              </div>

              <div>
                <h1 className="text-[#08051E] font-semibold text-sm">
                  Share your Video
                </h1>
                <div className="flex md:flex-row flex-col gap-3 items-center  max-w-md mt-3">
                  <div
                    className="inline-flex items-center text-sm px-2 py-1 text-[ry-900
#08051E] rounded gap-2 border border-[#0A0628]"
                  >
                    <FaFacebook color="#1877F2" size={18} /> Facebook
                  </div>
                  <div
                    className="inline-flex items-center text-sm px-2 py-1 text-[ry-900
#08051E] rounded gap-2 border border-[#0A0628]"
                  >
                    <FaWhatsapp color="#25D366" size={18} /> Whatsapp
                  </div>
                  <div
                    className="inline-flex items-center text-sm px-2 py-1 text-[ry-900
#08051E] rounded gap-2 border border-[#0A0628]"
                  >
                    <FaTelegram color="#2AABEE" size={18} /> Telegram
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="video-grid w-full">
            <div>
              <p className="text-[#08051E] font-semibold text-sm">Video URL:</p>
              <a
                href={videoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {videoURL}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Availabilty />
      <Footer />
    </>
  );
};

export default VideoPage;
