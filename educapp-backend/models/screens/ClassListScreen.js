import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator, 
    TouchableOpacity, 
    SafeAreaView,
    StatusBar
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClassListScreen = ({ navigation }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Charger les classes au démarrage
    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            
            // Remplace l'IP par celle de ton serveur si elle change
            const res = await axios.get('http://10.99.18.126:5000/api/classroom/my-school', {
                headers: { 'x-auth-token': token }
            });
            
            setClasses(res.data);
            setLoading(false);
            setRefreshing(false);
        } catch (err) {
            console.error("❌ Erreur API Classes:", err.response ? err.response.data : err.message);
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fonction pour rafraîchir en glissant vers le bas (Pull to refresh)
    const onRefresh = () => {
        setRefreshing(true);
        fetchClasses();
    };

    const renderClassItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.classCard}
            onPress={() => navigation.navigate('StudentList', { 
                classId: item._id, 
                className: item.nom 
            })}
        >
            <View style={styles.cardContent}>
                <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>{item.nom.substring(0, 1)}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.className}>{item.nom}</Text>
                    <Text style={styles.classLevel}>{item.niveau}</Text>
                </View>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.nbEleves || 0}</Text>
                    <Text style={styles.countLabel}>Élèves</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2c3e50" />
                <Text style={styles.loadingText}>Chargement des classes...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gestion des Classes</Text>
                <Text style={styles.headerSubtitle}>Sélectionnez une classe pour voir les élèves</Text>
            </View>

            <FlatList
                data={classes}
                keyExtractor={(item) => item._id}
                renderItem={renderClassItem}
                contentContainerStyle={styles.listPadding}
                onRefresh={onRefresh}
                refreshing={refreshing}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucune classe trouvée pour votre école.</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => {/* Action ajout */}}>
                            <Text style={styles.addButtonText}>+ Ajouter une classe</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
    headerSubtitle: { fontSize: 14, color: '#7f8c8d', marginTop: 5 },
    listPadding: { padding: 15 },
    classCard: { 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        marginBottom: 15, 
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
    },
    cardContent: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    iconCircle: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        backgroundColor: '#3498db', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    iconText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    infoContainer: { flex: 1, marginLeft: 15 },
    className: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
    classLevel: { fontSize: 14, color: '#95a5a6' },
    countBadge: { alignItems: 'center', backgroundColor: '#ecf0f1', padding: 8, borderRadius: 8, minWidth: 60 },
    countText: { fontSize: 16, fontWeight: 'bold', color: '#2980b9' },
    countLabel: { fontSize: 10, color: '#7f8c8d', textTransform: 'uppercase' },
    loadingText: { marginTop: 10, color: '#7f8c8d' },
    emptyContainer: { marginTop: 50, alignItems: 'center' },
    emptyText: { color: '#95a5a6', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    addButton: { backgroundColor: '#2ecc71', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
    addButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default ClassListScreen;