import { exec } from 'child_process';

export default function handler(req, res) {
  exec('whoami', (error, stdout) => {
    if (error) {
      return res.status(500).json({
        success: false,
        user: 'unknown'
      });
    }

    res.status(200).json({
      success: true,
      user: stdout.trim()
    });
  });
}