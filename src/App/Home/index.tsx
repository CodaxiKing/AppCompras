import {  useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, Alert } from 'react-native';
import { styles } from './style';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { FilterStatus } from '@/types/FilterStatus';
import { Item } from '@/components/Item';
import { itemsStorage, ItemStorage } from '@/storage/itemsStorage';



const FILTER_STATUS: FilterStatus[] = [FilterStatus.DONE, FilterStatus.PENDING];


export function Home() {
    const [filter, setFilter] = useState(FilterStatus.PENDING)
    const [description, setDescription] = useState('')
    const [items, setItems] = useState<ItemStorage[ ]>([]);



    async function handleAdd() {
        if (!description.trim()) {
            return Alert.alert('Atenção', 'Informe a descrição do item.')
        }
        const newItem = {
            id: Math.random().toString(36).substring(2),
            description,
            status: FilterStatus.PENDING,
        }

        await itemsStorage.add(newItem) 
        await itemsByStatus()


        Alert.alert('Sucesso', ` "${description}" foi adicionado com sucesso!`) 
        setDescription('') // Clear input after adding
        setFilter(FilterStatus.PENDING) // Reset filter to PENDING after adding an item
    }   

    async function itemsByStatus() {
        try {
            const response = await itemsStorage.getByStatus(filter)
            setItems(response)
        } catch (error) {
            Alert.alert('Atenção', 'Não foi possível carregar os itens.')
        }
    }

    async function handleRemove(id: string) {
        try {
            await itemsStorage.remove(id)
            await itemsByStatus()
            Alert.alert('Sucesso', 'Item removido com sucesso!')
        } catch (error) {
            Alert.alert('Atenção', 'Não foi possível remover o item.')
        }
    }

    function handleClear() {
        Alert.alert('Atenção', 'Deseja realmente remover todos os itens?', [
            { text: 'Não', style: 'cancel',},
            { text: 'Sim', onPress: async () => onClear(), },
        ])
    }        


    async function onClear() {
        try {
            await itemsStorage.clear()
            setItems([])
            Alert.alert('Sucesso', 'Todos os itens foram removidos!')
        } catch (error) {
            Alert.alert('Error', 'Não foi possível limpar os itens.')
        }
    }

    async function handleTouggleItemStatus(id: string) {
        try {
            await itemsStorage.toggleStatus(id)
            await itemsByStatus()
        } catch (error) {
            Alert.alert('Atenção', 'Não foi possível atualizar o status do item.')
        }
        
    }

    useEffect(() => {
        itemsByStatus()
    }, [filter]) 

    return (
         <View style={styles.container}>
            <Image source={require("@/assets/logo.png")} style={styles.logo} />

            <View style={styles.form}> 
                <Input placeholder="O que você precisa comprar?" 
                onChangeText={setDescription}
                value={description}
                />
                <Button title="Adicionar" onPress={handleAdd}/>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    {FILTER_STATUS.map((status) => (
                            <Filter 
                            key={status} 
                            status={status} 
                            isActive={filter === status}
                            onPress={() => setFilter(status)}
                            />      
                     ))}

                    <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                        <Text style={styles.clearText}>Limpar</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Item 
                            data={ item }
                            onRemove={() => handleRemove(item.id)}
                            onStatus={() => handleTouggleItemStatus(item.id)} 
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator}/>}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={() => <Text style={styles.empty}>Nenhum item aqui</Text>}
                />
            </View>
         </View>
    )

}
