import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CardScreen() {
    const { card_code } = useLocalSearchParams();
    const [card, setCard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCard() {
            try { 
                const response = await fetch(`${API_URL}/cards/${card_code}`);
                if (!response.ok)
                    throw new Error("Failed to fetch card");

                const data = await response.json();
                setCard(data);
            } catch (error) {
                console.error("Error fetching card:", error);
            } finally {
                setLoading(false);
            }        
        }
        if (card_code)
            fetchCard();
    }, [card_code]);

    if (loading) 
        return (<View><Text>Loading...</Text></View>);

    if (!card)
        return (<View><Text>Card not found</Text></View>);


    return (
        <View>
            <Text style={{ color: "white" }}>Card Code: {card.code}</Text>
            <Text style={{ color: "white" }}>Card Name: {card.name}</Text>
            <Text style={{ color: "white" }}>Card Status: {card.card_status}</Text>
        </View>
    );
}