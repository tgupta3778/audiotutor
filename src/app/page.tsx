"use client";
import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [audioFilePath, setAudioFilePath] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async function () {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        setInputValue(text);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async () => {
    let extractedText = inputValue;

    setIsLoadingAudio(true);
    setIsLoadingSummary(true);

    // Generate audio file
    const audioResponse = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: extractedText }),
    });

    if (audioResponse.ok) {
      const audioData = await audioResponse.json();
      setAudioFilePath(audioData.filePath);
    } else {
      console.error("Failed to synthesize speech:", audioResponse.statusText);
    }

    setIsLoadingAudio(false);

    // Generate summary
    const summaryResponse = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: extractedText }),
    });

    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      setSummaryText(summaryData.summary);
    } else {
      console.error("Failed to generate summary:", summaryResponse.statusText);
    }

    setIsLoadingSummary(false);
  };

  const handleDownload = () => {
    if (audioFilePath) {
      const link = document.createElement("a");
      link.href = audioFilePath;
      link.download = "output.mp3";
      link.click();
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-7xl font-bold text-center sm:text-left">
          AudioTutor
        </h1>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by uploading your PDF file.
          </li>
          <li className="tracking-[-.01em]">
            Submit and download your new MP3 file.
          </li>
        </ol>
        <div className="flex flex-col gap-4 mt-8">
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="border border-gray-300 rounded-md p-2 w-full sm:w-96"
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Or enter some text manually"
            className="border border-gray-300 rounded-md p-2 w-full sm:w-96"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          >
            Submit
          </button>
          {isLoadingAudio && <p>Loading audio...</p>}
          {audioFilePath && (
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
            >
              Download Audio
            </button>
          )}
          {isLoadingSummary && <p>Loading summary...</p>}
          {summaryText && (
            <div className="summary-box border border-gray-300 rounded-md p-4">
              <h2 className="text-lg font-bold">Generated Summary:</h2>
              <p>{summaryText}</p>
            </div>
          )}
          {summaryText && (
            <button
              onClick={() => window.print()}
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mt-2"
            >
              Print Summary
            </button>
          )}
        </div>
      </main>
      <style jsx>{`
        .summary-box {
          background-color: #f9f9f9;
          color: #333;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .summary-box,
          .summary-box * {
            visibility: visible;
          }
          .summary-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
