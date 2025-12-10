import { useRef, useState } from "react";
import {
  FaThumbtack,
  FaSave,
  FaEdit,
  FaBell,
  FaDownload,
  FaExpand,
  FaLock,
  FaTrashAlt,
  FaRegCalendarAlt,
  FaSync,
  FaArchive,
  FaFlag,
} from "react-icons/fa"; // react-icons'dan ikonlar
import MenuItem from "./MenuItem";
import useOnClickOutside from "../../helpers/clickOutside";
import { savePost } from "../../functions/post";
import { deletePost } from "../../functions/post";
import { saveAs } from "file-saver";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function PostMenu({
  postUserId,
  userId,
  imagesLength,
  setShowMenu,
  token,
  postId,
  images,
}) {
  const [test, setTest] = useState(postUserId === userId ? true : false);
  const menu = useRef(null);
  useOnClickOutside(menu, () => setShowMenu(false));

  const saveHandler = () => {
    savePost(postId, token, userId);
  };

  console.log("images", images);

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const downloadHandler = () => {
    images.forEach((url, index) => {
      if (typeof url === "string") {
        saveAs(url, `image-${index + 1}.jpg`);
      }
    });
  };

const deleteHandler = async () => {
  try {
    await deletePost(postId, token); // deletePost fonksiyonunun promise döndüğünü varsayıyoruz
    toast.success("Post deleted successfully!");
    setShowMenu(false); // Menü kapatmak istersen
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete post.");
  }
};
  return (
    <ul className="post_menu" ref={menu}>
      {/* Pin Post: Eğer kullanıcı postu paylaşan kişiyle aynıysa */}
      {test && <MenuItem icon={<FaThumbtack />} title="Pin Post" />}

      <div onClick={() => saveHandler()}>
        {/* Save Post */}
        <MenuItem
          icon={<FaSave />}
          title="Save Post"
          subtitle="Add this to your saved items."
          onClick={saveHandler}
        />
      </div>

      <div className="line"></div>

      {/* Edit Post: Eğer kullanıcı postu paylaşan kişiyle aynıysa */}
      {test && <MenuItem icon={<FaEdit />} title="Edit Post" />}

      {/* Eğer kullanıcı postu paylaşan kişiyle aynı değilse, bildirim açma seçeneği */}
      {!test && (
        <MenuItem
          icon={<FaBell />}
          title="Turn on notifications for this post"
        />
      )}

      <div onClick={downloadHandler}>
        {/* Resim varsa, indir ve fullscreen seçenekleri */}
        {imagesLength > 0 && (
          <>
            <MenuItem icon={<FaDownload />} title="Download" />
          </>
        )}
      </div>

      <MenuItem icon={<FaExpand />} title="Enter Fullscreen" />

      {/* Kullanıcı postu paylaşan kişiyle aynıysa, diğer seçenekler */}
      {test && (
        <MenuItem img="/facebook/icons/lock.png" title="Edit audience" />
      )}
      {test && (
        <MenuItem
          icon={<FaBell />}
          title="Turn off notifications for this post"
        />
      )}
      {test && <MenuItem icon={<FaTrashAlt />} title="Turn off translations" />}
      {test && <MenuItem icon={<FaRegCalendarAlt />} title="Edit Date" />}
      {test && <MenuItem icon={<FaSync />} title="Refresh share attachment" />}
      {test && <MenuItem icon={<FaArchive />} title="Move to archive" />}
      {test && (
        <div onClick={deleteHandler}>
          <MenuItem
            icon={<FaTrashAlt />}
            title="Move to trash"
            subtitle="Items in your trash are deleted after 30 days"
          />
        </div>
      )}

      {/* Eğer kullanıcı postu paylaşan kişiyle aynı değilse, raporlama seçeneği */}
      {!test && <div className="line"></div>}
      {!test && (
        <MenuItem
          icon={<FaFlag />}
          title="Report post"
          subtitle="I'm concerned about this post"
        />
      )}
          <ToastContainer position="top-right" autoClose={3000} />
    </ul>
  );
}
