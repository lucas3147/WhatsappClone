import {
    DonutLarge as DonutLargeIcon,
    Chat as ChatIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    AttachFile as AttachFileIcon,
    EmojiEmotions as EmojiEmotionsIcon,
    Close as CloseIcon,
    Send as SendIcon,
    Mic as MicIcon,
    InsertEmoticon as InsertEmoticonIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Check as CheckIcon,
    Refresh as RefreshIcon,
    Autorenew as AutorenewIcon,
    CloseOutlined as CloseOutlinedIcon,
    VideoCameraFrontRounded as VideoCameraFrontRoundedIcon,
    Menu as MenuIcon,
    Settings as SettingsIcon,
    Videocam as VideoCamIcon,
    NoPhotography as NoPhotographyIcon,
    MonochromePhotosOutlined as MonochromePhotosOutlinedIcon,
    MicOff as MicOffIcon,
    KeyboardVoice as KeyboardVoiceIcon,
    LeakRemove as LeakRemoveIcon,
    LeakAdd as LeakAddIcon,
    VideocamOff,
    LocalSee as LocalSeeIcon
} from '@mui/icons-material';

type IconType = keyof typeof iconMap;

export type IconItemProps = {
    type: IconType;
    style: React.CSSProperties;
    className?: string;
    onclick?: () => void;
};

export const iconMap = {
    DonutLargeIcon,
    ChatIcon,
    MoreVertIcon,
    SearchIcon,
    AttachFileIcon,
    EmojiEmotionsIcon,
    CloseIcon,
    SendIcon,
    MicIcon,
    InsertEmoticonIcon,
    ArrowBackIcon,
    EditIcon,
    CheckIcon,
    RefreshIcon,
    AutorenewIcon,
    CloseOutlinedIcon,
    VideoCameraFrontRoundedIcon,
    MenuIcon,
    SettingsIcon,
    VideoCamIcon,
    NoPhotographyIcon,
    MonochromePhotosOutlinedIcon,
    MicOffIcon,
    KeyboardVoiceIcon,
    LeakRemoveIcon,
    LeakAddIcon,
    VideocamOff,
    LocalSeeIcon
};