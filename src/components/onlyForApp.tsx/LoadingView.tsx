import React, {
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { intervalToDuration } from 'date-fns'
import _ from 'lodash'

import { ExtLink, Icon, Row, Text } from 'components'
import images from 'assets/images'
import { useRecoilValue } from 'recoil'
import AppStore from 'stores/AppStore'
import useFinder from 'lib/hooks/useFinder'
import { truncate } from 'lib/utils/format'
import color from 'styles/color'

export const LoadingView = (): ReactElement => {
  const showLoading = useRecoilValue(AppStore.showLoading)
  const txhash = useRecoilValue(AppStore.loadingTxHash)

  const start = useMemo(() => new Date(), [txhash])

  const [now, setNow] = useState(new Date())
  const getLink = useFinder()
  const link = getLink?.({ q: 'tx', v: txhash })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (txhash) {
      interval = setInterval(() => setNow(new Date()), 1000)
    }
    return (): void => {
      interval && clearInterval(interval)
      setNow(new Date())
    }
  }, [txhash])

  const { minutes, seconds } = intervalToDuration({ start, end: now })

  const fromNow = [minutes, seconds]
    .map((str) => String(str).padStart(2, '0'))
    .join(':')

  return showLoading ? (
    <View style={styles.container}>
      <Image
        source={images.loading_image}
        style={{ width: 160, height: 160, marginBottom: 5 }}
      />
      <Text style={styles.title} fontType={'bold'}>
        Broadcasting transaction
      </Text>

      {_.some(txhash) && (
        <>
          <View style={styles.infoBox}>
            <Row
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 26,
                paddingTop: 10,
              }}
            >
              <Text
                style={{ fontSize: 16, paddingRight: 5 }}
                fontType="bold"
              >
                QUEUED
              </Text>
              <Image
                source={images.queued}
                style={{ width: 20, height: 12 }}
              />
            </Row>
            <Text style={styles.timer} fontType="medium">
              {fromNow}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                paddingBottom: 20,
                borderBottomColor: 'rgba(32, 67, 181, 0.2)',
                borderBottomWidth: 1,
              }}
            >
              This transaction is in process.
            </Text>
            {link && (
              <ExtLink
                url={link}
                title={
                  <Row
                    style={{
                      justifyContent: 'space-between',
                      paddingTop: 20,
                    }}
                  >
                    <Text
                      style={{ color: color.primary._02 }}
                      fontType="medium"
                    >
                      Tx Hash
                    </Text>
                    <Row>
                      <Text
                        style={{
                          color: color.primary._03,
                          paddingRight: 5,
                        }}
                        fontType="medium"
                      >
                        {truncate(txhash, [6, 6])}
                      </Text>
                      <Icon
                        size={18}
                        color={color.primary._03}
                        name={'open-in-new'}
                      />
                    </Row>
                  </Row>
                }
              />
            )}
          </View>
        </>
      )}
    </View>
  ) : (
    <View />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'center',
    paddingBottom: 20,
  },
  timer: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    paddingBottom: 20,
  },
  infoBox: {
    width: '100%',
    padding: 20,
    borderRadius: 8,
    backgroundColor: color.primary._04,
  },
})
