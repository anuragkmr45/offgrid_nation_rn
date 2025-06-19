// components/marketplace/ProductCard.tsx

import { theme } from '@/constants/theme'
import React from 'react'
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

export interface Product {
    id: string
    imageUrl: string
    price: string   // e.g. "$130"
    title: string   // e.g. "Road bike"
}

export interface ProductCardProps {
    product: Product
    /** Called when the card is tapped */
    onPress: (id: string) => void
    /** Override the card’s width (default: 2-column grid) */
    cardWidth?: number
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
// two columns, 16px padding on each side + 16px between cards → total horizontal spacing = 48
const DEFAULT_CARD_WIDTH = (SCREEN_WIDTH - 48) / 2

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
    cardWidth = DEFAULT_CARD_WIDTH,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.cardContainer, { width: cardWidth }]}
            onPress={() => onPress(product.id)}
        >
            {/* Product image (square) */}
            <Image
                source={{ uri: product.imageUrl }}
                style={[styles.image, { height: cardWidth }]}
                resizeMode="cover"
            />

            {/* Footer with price and title */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    <Text style={styles.price}>{product.price}</Text>
                    {` – ${product.title}`}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: theme.borderRadius,
        overflow: 'hidden',
        backgroundColor: theme.colors.background,
        marginBottom: 16,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    image: {
        width: '100%',
    },
    footer: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    footerText: {
        fontSize: theme.fontSizes.bodyMedium,
        color: theme.colors.textPrimary,
        fontWeight: "500",
    },
    price: {
        fontWeight: "700",
    },
})
