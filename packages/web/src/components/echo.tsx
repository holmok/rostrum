import { ReactElement } from 'react'
import { getClients } from '../pages/_app'
import { EchoRequest } from '@rostrum/common'
import SWR from 'swr'
import SimpleClient from '@rostrum/common/dist/clients/system-client'

export interface EchoProps {
  message: string
}

export default function Echo (props: EchoProps): ReactElement {
  const system: SimpleClient = getClients().system()
  const request: EchoRequest = { message: props.message }

  const { data, error } = SWR(`${system.names.echo}_${props.message}`, async () => await system.echo(request))

  if (data == null) {
    return (<></>) // loading
  } else if (error != null) {
    return (<div className='errors'>{error.message}</div>)
  } else {
    return (<pre className='code'>{JSON.stringify(data, null, 2)}</pre>)
  }
}