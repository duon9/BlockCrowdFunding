'use client'

import { useCrowdfunding } from "@/app/hooks/useCrowdfunding"
import { useEffect, useState } from "react"
import { Users, Coins, Clock, TrendingUp } from "lucide-react"

const Statistics = () => {
  const { campaigns } = useCrowdfunding()
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalDonations: 0,
    totalDonators: 0,
    successRate: 0
  })

  useEffect(() => {
    try {
      if (campaigns && campaigns.length > 0) {
        const totalProjects = campaigns.length
        const totalDonations = campaigns.reduce((acc: number, campaign: any) => acc + Number(campaign.amountCollected), 0)
        const totalDonators = campaigns.reduce((acc: number, campaign: any) => acc + (campaign.donators?.length || 0), 0)
        const successRate = totalProjects > 0 ? (campaigns.filter((c: any) => Number(c.amountCollected) >= Number(c.target)).length / totalProjects) * 100 : 0

        setStats({
          totalProjects,
          totalDonations,
          totalDonators,
          successRate
        })
      }
    } catch (error) {
      console.error('Error calculating stats:', error)
    }
  }, [campaigns])

  const statsItems = [
    {
      icon: <Coins className="w-6 h-6" />,
      label: "Tổng số dự án",
      value: stats.totalProjects
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Tổng số người ủng hộ",
      value: stats.totalDonators
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Tổng số tiền huy động",
      value: `${stats.totalDonations.toFixed(2)} ETH`
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Tỷ lệ thành công",
      value: `${stats.successRate.toFixed(1)}%`
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsItems.map((item, index) => (
        <div 
          key={index}
          className="bg-secondary/30 backdrop-blur-sm rounded-xl p-6 space-y-3 border border-border/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-hufa/90 rounded-lg">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Statistics 