export type LearningTabId = 'inProgress' | 'saved' | 'completed'

export const learningTabs: { id: LearningTabId; label: string }[] = [
  { id: 'inProgress', label: 'В процессе' },
  { id: 'saved', label: 'Сохраненные' },
  { id: 'completed', label: 'Завершенные' }
]

type LearningTabsProps = {
  activeTab: LearningTabId
  onChange: (tabId: LearningTabId) => void
}

export default function LearningTabs({ activeTab, onChange }: LearningTabsProps): JSX.Element {
  return (
    <div className="tabs">
      {learningTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`tab-item ${activeTab === tab.id ? 'tab-item--active' : 'tab-item--inactive'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
