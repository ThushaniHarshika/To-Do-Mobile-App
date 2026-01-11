import { View, ScrollView } from 'react-native'
import React from 'react'
import useTheme from '@/hooks/useTheme'
import { createSettingsStyles } from '@/assets/images/styles/settings.styles'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ProgressStats from '@/compnoents/ProgressStats'
import Preferences from '@/compnoents/Preferences'
import { Text } from '@react-navigation/elements'

const SettingsScreen = () => {

  const { colors } = useTheme()
  const settingStyle = createSettingsStyles(colors)

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <View style={settingStyle.header}>
          <View style={settingStyle.titleContainer}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={settingStyle.iconContainer}
            >
              <Ionicons name="settings" size={28} color="#ffffff" />
              
            </LinearGradient>
            <Text style={settingStyle.title}>Settings</Text>
          </View>
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
            flexGrow: 1,
          }}
        >
          <ProgressStats />
          <Preferences />
        </ScrollView>

      </SafeAreaView>
    </LinearGradient>
  )
}

export default SettingsScreen
