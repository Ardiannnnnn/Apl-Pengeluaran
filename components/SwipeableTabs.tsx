import React, { useRef, useEffect } from 'react';
import PagerView from 'react-native-pager-view';
import { View } from 'react-native';

interface SwipeableTabsProps {
  children: React.ReactNode[];
  activeIndex: number;
  onPageSelected: (index: number) => void;
}

export default function SwipeableTabs({
  children,
  activeIndex,
  onPageSelected,
}: SwipeableTabsProps) {
  const pagerRef = useRef<PagerView>(null);

  // Sync pager with active index
  useEffect(() => {
    if (pagerRef.current) {
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