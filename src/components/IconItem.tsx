import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutorenewIcon from '@mui/icons-material/Autorenew';

type Props = {
    type: IconType,
    style: {},
    className?: string
}

type IconType = 'AutorenewIcon' | 'RefreshIcon' | 'CheckIcon' | 'EditIcon' | 'ArrowBackIcon' | 'InsertEmoticonIcon' | 'MicIcon' | 'SendIcon' | 'CloseIcon' | 'EmojiEmotionsIcon' | 'DonutLargeIcon' |'AttachFileIcon' | 'ChatIcon' | 'MoreVertIcon' | 'SearchIcon';

const IconItem = ({type, style, className}: Props) => {
    return (
        <div className={className}>
            {type == 'DonutLargeIcon' &&
                <DonutLargeIcon style={style} />
            }
            {type == 'ChatIcon' &&
                <ChatIcon style={style} />
            }
            {type == 'MoreVertIcon' &&
                <MoreVertIcon style={style} />
            }
            {type == 'SearchIcon' &&
                <SearchIcon fontSize='small' style={style} />
            }
            {type == 'AttachFileIcon' &&
                <AttachFileIcon style={style}/>
            }
            {type == 'EmojiEmotionsIcon' &&
                <EmojiEmotionsIcon style={style}/>
            }
            {type == 'CloseIcon' &&
                <CloseIcon style={style}/>
            }
            {type == 'SendIcon' &&
                <SendIcon style={style}/>
            }
            {type == 'MicIcon' &&
                <MicIcon style={style}/>
            }
            {type == 'InsertEmoticonIcon' &&
                <InsertEmoticonIcon style={style}/>
            }
            {type == 'ArrowBackIcon' &&
                <ArrowBackIcon style={style}/>
            }
            {type == 'EditIcon' &&
                <EditIcon style={style}/>
            }
            {type == 'CheckIcon' &&
                <CheckIcon style={style}/>
            }
            {type == 'RefreshIcon' &&
                <RefreshIcon style={style}/>
            }
            {type == 'AutorenewIcon' &&
                <AutorenewIcon style={style}/>
            }
        </div>
    )
}

export default IconItem;