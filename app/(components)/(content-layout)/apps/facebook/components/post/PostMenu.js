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

export default function PostMenu({
  postUserId,
  userId,
  imagesLength,
  setShowMenu,
}) {
  const [test, setTest] = useState(postUserId === userId ? true : false);
  const menu = useRef(null);
  useOnClickOutside(menu, () => setShowMenu(false));

  return (
    <ul className="post_menu" ref={menu}>
      {/* Pin Post: Eğer kullanıcı postu paylaşan kişiyle aynıysa */}
      {test && <MenuItem icon={<FaThumbtack />} title="Pin Post" />}

      {/* Save Post */}
      <MenuItem
        icon={<FaSave />}
        title="Save Post"
        subtitle="Add this to your saved items."
      />

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

      {/* Resim varsa, indir ve fullscreen seçenekleri */}
      {imagesLength > 0 && (
        <>
          <MenuItem icon={<FaDownload />} title="Download" />
          <MenuItem icon={<FaExpand />} title="Enter Fullscreen" />
        </>
      )}

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
        <MenuItem
          icon={<FaTrashAlt />}
          title="Move to trash"
          subtitle="Items in your trash are deleted after 30 days"
        />
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
    </ul>
  );
}
