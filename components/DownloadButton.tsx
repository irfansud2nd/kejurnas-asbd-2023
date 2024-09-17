"use client";
import { useState, useEffect } from "react";
import { BsCloudDownload } from "react-icons/bs";
import InlineLoading from "./loading/InlineLoading";
import FileSaver from "file-saver";
import { getProposalLink } from "@/utils/actions";

const DownloadButton = () => {
  const [downloadLink, setDownloadLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getLink();
  }, []);
  const getLink = async () => {
    try {
      const { result, error } = await getProposalLink();
      if (error) throw error;

      setDownloadLink(result);
    } catch (error) {
      setErrorMessage("Download proposal tidak tersedia");
    }
  };

  return (
    <button
      className="bg-white px-2 py-1 hover:bg-red-500 hover:text-white transition w-[200px]"
      onClick={() => FileSaver.saveAs(downloadLink)}
      disabled={!downloadLink}
    >
      {downloadLink ? (
        <>
          Download Proposal <BsCloudDownload className="inline mb-1" />
        </>
      ) : errorMessage ? (
        errorMessage
      ) : (
        <>
          <span>Memuat Proposal</span> <InlineLoading />
        </>
      )}
    </button>
  );
};
export default DownloadButton;
