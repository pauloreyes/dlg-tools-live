"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";

const SrtToVtt: React.FC = () => {
  const [srtContent, setSrtContent] = useState("");
  const [vttContent, setVttContent] = useState("");
  const [filename, setFilename] = useState("");
  const [showSave, setShowSave] = useState(false);

  const convert = () => {
    const webvtt = srt2webvtt(srtContent);
    setVttContent(webvtt);
    setShowSave(true);
  };

  const saveFile = () => {
    const blob = new Blob([vttContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${filename}.vtt`);
  };

  const srt2webvtt = (data: string) => {
    let srt = data.replace(/\r+/g, "");
    srt = srt.replace(/^\s+|\s+$/g, "");
    const cuelist = srt.split("\n\n");
    let result = "";

    if (cuelist.length > 0) {
      result += "WEBVTT\n\n";
      for (let i = 0; i < cuelist.length; i++) {
        result += convertSrtCue(cuelist[i]);
      }
    }

    return result;
  };

  const convertSrtCue = (caption: string) => {
    let cue = "";
    const s = caption.split(/\n/);

    while (s.length > 3) {
      for (let i = 3; i < s.length; i++) {
        s[2] += "\n" + s[i];
      }
      s.splice(3, s.length - 3);
    }

    let line = 0;

    if (s[1] && !s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
      cue += s[0].match(/\w+/) + "\n";
      line += 1;
    }

    if (s[line].match(/\d+:\d+:\d+/)) {
      const m = s[line].match(
        /(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/
      );
      if (m) {
        cue += `${m[1]}:${m[2]}:${m[3]}.${m[4]} --> ${m[5]}:${m[6]}:${m[7]}.${m[8]}\n`;
        line += 1;
      } else {
        return "";
      }
    } else {
      return "";
    }

    if (s[line]) {
      cue += s[line] + "\n\n";
    }

    return cue;
  };

  return (
    <div className="maincontainer">
      <div className="subcontainer">
        <p>
          Copy and paste the content of the SRT file into the text entry box.
          Then, press <b>Convert.</b>
        </p>
        <textarea
          className="w-full h-64 p-2 border rounded my-2"
          value={srtContent}
          onChange={(e) => setSrtContent(e.target.value)}
        />
        <button
          onClick={convert}
          className="w-full px-4 py-2 mt-1 rounded-full text-white bg-blue-500"
        >
          Convert
        </button>
      </div>
      <br />
      <div id="webvtt" className="subcontainer">
        {vttContent && (
          <textarea
            className="w-full h-64 p-2 border rounded"
            value={vttContent}
            readOnly
          />
        )}
      </div>
      {showSave && (
        <div id="savecontainer">
          <label>
            Filename:{" "}
            <input
              type="text"
              className="filename"
              placeholder="Type filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            .vtt
          </label>
          <button
            type="button"
            onClick={saveFile}
            className="w-full px-4 py-2 mt-4 rounded-full text-white bg-blue-500"
          >
            Save As
          </button>
        </div>
      )}
    </div>
  );
};

export default SrtToVtt;
