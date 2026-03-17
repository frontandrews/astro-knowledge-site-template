import { AnimatePresence, m } from 'motion/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { pageTransitionVariants } from '@/lib/motion'
import { AppShell } from '@/components/app-shell'
import { DailyQueuePage } from '@/routes/daily-queue-page'
import { DeckDetailPage } from '@/routes/deck-detail-page'
import { HomePage } from '@/routes/home-page'
import { MockInterviewPage } from '@/routes/mock-interview-page'
import { PremiumPage } from '@/routes/premium-page'
import { ProgressPage } from '@/routes/progress-page'
import { ReviewPage } from '@/routes/review-page'
import { SettingsPage } from '@/routes/settings-page'
import { StudyPage } from '@/routes/study-page'

export function AppRoutes() {
  const location = useLocation()

  return (
    <AppShell>
      <AnimatePresence initial={false} mode="wait">
        <m.div
          animate="animate"
          className="h-full"
          exit="exit"
          initial="initial"
          key={`${location.pathname}${location.search}`}
          variants={pageTransitionVariants}
        >
          <Routes location={location}>
            <Route element={<HomePage />} path="/" />
            <Route element={<DailyQueuePage />} path="/daily-queue" />
            <Route element={<DeckDetailPage />} path="/decks/:deckId" />
            <Route element={<MockInterviewPage />} path="/mock-interview" />
            <Route element={<PremiumPage />} path="/premium" />
            <Route element={<ProgressPage />} path="/progress" />
            <Route element={<ReviewPage />} path="/decks/:deckId/review" />
            <Route element={<SettingsPage />} path="/settings" />
            <Route element={<StudyPage />} path="/study/:deckId" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Routes>
        </m.div>
      </AnimatePresence>
    </AppShell>
  )
}
