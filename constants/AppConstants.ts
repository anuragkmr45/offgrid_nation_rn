// constants\AppConstants.ts

import { Dimensions } from 'react-native'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export const APP_NAME: string = "Offgrid Nation"
export const APP_LOGO_BLACK: string = "https://res.cloudinary.com/dkwptotbs/image/upload/v1749901385/fr-bg-black_rwqtim.png"
export const APP_LOGO_WHITE: string = "https://res.cloudinary.com/dkwptotbs/image/upload/v1749901306/fr-bg-white_hea7pb.png"
export const AVATAR_FALLBACK: string = "https://res.cloudinary.com/dtxm0dakw/image/upload/v1744723246/r3hsrs6dnpr53idcjtc5.png"
export const CATEGORY_ICON_FALLBACK: string = "https://res.cloudinary.com/dtxm0dakw/image/upload/v1744723246/r3hsrs6dnpr53idcjtc5.png"
export const LIKE_ICON: string = "https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/post-like-icon_tk5wtx.png"
export const DISLIKE_ICON: string = "https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/post-dislike-icon_wfnpoq.png"
export const COMMENT_ICON: string = "https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/comment-icon_tpavcd.png"
export const SHARE_ICON: string = "https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/share-icon_ij6xgh.png"
export const POST_CARD_HEIGHT   = SCREEN_HEIGHT * 0.8
export const POST_MEDIA_WIDTH   = SCREEN_WIDTH  - 32
export const POST_MEDIA_HEIGHT  = (POST_MEDIA_WIDTH * 16) / 9