import React, { ReactElement, useEffect, useState } from 'react'
import { useAuth, User, useValidator } from 'use-station/src'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'

import { RootStackParams } from '../../../types/navigation'

import Top from './Top'
import Actions from './Actions'
import MonikerInfo from './MonikerInfo'
import Informations from './Informations'

type Props = StackScreenProps<RootStackParams, 'ValidatorDetail'>

const Render = ({
  user,
  address,
}: {
  user?: User
  address: string
}): ReactElement => {
  const { ui, loading } = useValidator(address, user)
  return (
    <>
      {loading ? null : (
        <>
          {ui && (
            <Body
              scrollable
              containerStyle={{ paddingHorizontal: 0 }}
            >
              <Top ui={ui} />
              {user && <Actions ui={ui} user={user} />}
              <MonikerInfo ui={ui} />
              <Informations {...ui} />
            </Body>
          )}
        </>
      )}
    </>
  )
}

const Screen = ({ navigation, route }: Props): ReactElement => {
  const { user } = useAuth()

  const { address } = route.params
  const [refreshing, setRefreshing] = useState(false)
  const refreshPage = async (): Promise<void> => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 100)
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      refreshPage()
    })
  }, [])

  return (
    <Body
      theme={'sky'}
      containerStyle={{ paddingTop: 20 }}
      scrollable
      onRefresh={refreshPage}
    >
      {refreshing ? null : <Render user={user} address={address} />}
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'white',
})

export default Screen
