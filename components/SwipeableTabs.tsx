import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';

interface SwipeableTabViewProps {
  children: React.ReactNode[];
  activeIndex: number;
  onPageSelected: (index: number) => void;
}

export default function SwipeableTabView({
  children,
  activeIndex,
  onPageSelected,
}: SwipeableTabViewProps) {
  const pagerRef = useRef<PagerView>(null);

  // Sync pager with active index when tab is pressed
  useEffect(() => {
    if (pagerRef.current && activeIndex >= 0) {
      pagerRef.current.setPage(activeIndex);
    }
  }, [activeIndex]);

  const handlePageSelected = (e: any) => {
    const newIndex = e.nativeEvent.position;
    onPageSelected(newIndex);
  };

  return (
    <PagerView
      ref={pagerRef}
      style={{ flex: 1 }}
      initialPage={activeIndex}
      onPageSelected={handlePageSelected}
      orientation="horizontal"
      overdrag={true}
    >
      {children.map((child, index) => (
        <View key={index} style={{ flex: 1 }}>
          {child}
        </View>
      ))}
    </PagerView>
  );
}