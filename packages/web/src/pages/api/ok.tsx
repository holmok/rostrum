
import type { NextApiRequest, NextApiResponse } from 'next'
export default function handler (req: NextApiRequest, res: NextApiResponse<{status: string}>): any {
  res.status(200).json({ status: 'ok' })
}
