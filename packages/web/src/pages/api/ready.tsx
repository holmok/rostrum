import type { NextApiRequest, NextApiResponse } from 'next'
import { getClients } from '../_app'

export default async function handler (req: NextApiRequest, res: NextApiResponse<{ status: string }>): Promise<void> {
  const system = getClients().system()
  try {
    await system.okay()
  } catch (err) {
    res.status(500).json({ status: 'backend not up' })
    return
  }
  try {
    await system.ready()
  } catch (err) {
    res.status(500).json({ status: 'backend not ready' })
    return
  }
  res.status(200).json({ status: 'ready' })
}
