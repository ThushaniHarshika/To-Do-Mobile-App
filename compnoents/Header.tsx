import { View, Text } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from "@/convex/_generated/api"
import { createHomeStyles } from '@/assets/images/styles/home.styles'
import useTheme from '@/hooks/useTheme'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'


const Header = () => {

    const {colors} = useTheme();

    const homeStyles = createHomeStyles(colors);

    const todos = useQuery(api.todos.getTodos);

    const completeCount = todos ? todos.filter((todo) => todo.isCompleted).length : 0;
    const totalCount = todos ? todos.length : 0;
    const progressPresentage = totalCount > 0 ? (completeCount/totalCount)*100 : 0;

  return (
    <View style={homeStyles.header}>
      <View style={homeStyles.titleContainer}>
        <LinearGradient colors={colors.gradients.primary} style={homeStyles.iconContainer}>
            <Ionicons name='flash-outline' size={28} color="#ffffff"/>
        </LinearGradient>

        <View style={homeStyles.titleTextContainer}>
            <Text style={homeStyles.title}>Today&apos;s Tasks</Text>
            <Text style={homeStyles.subtitle}>
                {completeCount} of {totalCount}
                Completed
            </Text>
        </View>
      </View>
      {true  && (
        <View style={homeStyles.progressContainer}>
            <View style={homeStyles.progressBarContainer}>
                <View style={homeStyles.progressBar}>
                    <LinearGradient 
                        colors={colors.gradients.success}
                        style={[homeStyles.progressBar,{width:`${progressPresentage}%`}]}
                    />
                </View>
                <Text style={homeStyles.progressText}>{Math.round(progressPresentage)}%</Text>
            </View>
        </View>
      )}
    </View>
  )
}

export default Header