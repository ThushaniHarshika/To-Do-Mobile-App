import { createHomeStyles } from "@/assets/images/styles/home.styles";
import { api } from "@/convex/_generated/api";
import useTheme, { ColorScheme } from "@/hooks/useTheme";
import { useMutation, useQuery } from "convex/react";
import { Link } from "expo-router";
import {Alert, FlatList, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient"
import Header from "@/compnoents/Header";
import TodoInputs from "@/compnoents/TodoInputs";
import LoadingSpinner from "@/compnoents/LoadingSpinner";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "@/compnoents/EmptyState";
import { useState } from "react";

type Todo = Doc<"todos">

export default function Index() {
  const {colors} = useTheme();

  const [editingId,setEditingId] = useState<Id<"todos"> | null>(null);
  const [editText,setEditText] = useState("");

  const homeStyles = createHomeStyles(colors);

  const todos = useQuery(api.todos.getTodos);
  const toggleTodo = useMutation(api.todos.toggleTodo)
  const deteteTodo = useMutation(api.todos.deteteTodo)
  const updateTodo = useMutation(api.todos.updateTodo)

  const isLoading = todos === undefined

  if(isLoading) return <LoadingSpinner/>

  const handleToggleTodo = async(id:Id<"todos">) => {
    try {
      await toggleTodo({id})
    } catch (error) {
      console.log("Error toggling todo",error);
      Alert.alert("Error","Failed to toggle todo");
    }
  }

  const handleDeleteTodo = async(id: Id<"todos">) =>{
    Alert.alert("Dekete Todo item","Are you shure you want to delete this item?",[
      {text:"Cancel",style:"cancel"},
      {text:"Delete",style:"destructive",onPress:() => deteteTodo({id})}
    ])
  }

  const handleEditTodo = (todo:Todo) => {
    setEditText(todo.text)
    setEditingId(todo._id)
  }

  const handleSaveEdit = async() => {
    if(editingId){
        try {
          await updateTodo({id:editingId,text:editText.trim()})
          setEditingId(null)
          setEditText("")
        } catch (error) {
      
        }
    }
    
  }

  const handleCancelEdit = () => {
    setEditText("");
    setEditingId(null);
  }

  const renderTodoItem = ({item} : {item:Todo}) => {
    const isEditing = editingId === item._id
    return(
      <View style={homeStyles.todoItemWrapper}>
        <LinearGradient
          colors={colors.gradients.surface}
          style={homeStyles.todoItem}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
        >
          <TouchableOpacity
              style={homeStyles.checkbox}
              activeOpacity={0.7}
              onPress={() => handleToggleTodo(item._id)}
            >
              <LinearGradient
                colors={
                  item.isCompleted
                    ? colors.gradients.success
                    : colors.gradients.muted
                }
                style={homeStyles.checkboxInner}   // ✅ ADD THIS
              >
                {item.isCompleted && (
                  <Ionicons name="checkmark" size={18} color="#ffffff" />
                )}
              </LinearGradient>
            </TouchableOpacity>

            {isEditing ? (
              <View style={homeStyles.editContainer}>
              <TextInput
                style={homeStyles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                placeholder="Edit your todo..."
                placeholderTextColor={colors.textMuted}
              />
              <View style={homeStyles.editButtons}>
                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.success} style={homeStyles.editButton}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.muted} style={homeStyles.editButton}>
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            ) : (
              <View style = {homeStyles.todoTextContainer}>
              <Text
                style={[
                  homeStyles.todoText,
                  item.isCompleted && {
                    textDecorationLine: "line-through",
                    color: colors.textMuted,
                    opacity: 0.6,
                  },
                ]}
              >
                {item.text}
              </Text>
              <View style = {homeStyles.todoActions}>
                <TouchableOpacity onPress={()=> handleEditTodo(item)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.warning} style={homeStyles.actionButton}>
                    <Ionicons name="pencil" size = {25} color="#ffffff"/>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>handleDeleteTodo(item._id)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.danger} style={homeStyles.actionButton}>
                    <Ionicons name="trash" size = {25} color="#ffffff"/>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            )}
        </LinearGradient>
      </View>
    )
  }

  return (
    <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
      <SafeAreaView
      style={
        homeStyles.safeArea
      }
    >
      <Header/>
      <TodoInputs/>

      <FlatList 
        data = {todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item._id}
        style = {homeStyles.todoList}
        contentContainerStyle={homeStyles.todoListContent}
        ListEmptyComponent={<EmptyState/>}
        showsVerticalScrollIndicator={false}
      />
      
    </SafeAreaView>
    </LinearGradient>
    
  );
}

