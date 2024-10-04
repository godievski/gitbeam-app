import React, { useMemo, useCallback, useState } from "react";
import { compareDate } from "../../../../core/utils";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import CommitRow from "./CommitRow";
import SectionListHeader from "../../../../components/Commons/SectionListHeader";
import { TCommit } from "../../../../core/gitlab/types/commits_types";
import SectionList from "../../../../components/RN/SectionList";
import moment from "moment";
// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en);

export interface CommitsListProps {
  items: TCommit[];
  onPressItem: (item: TCommit) => any;
  onLongPress: (item: TCommit) => any;
  refreshControl;
  renderFooter: () => React.ReactElement | null;
  refreshing: boolean;
  onRealEndReached: () => void;
}

interface CommitsSection {
  title: string;
  data: TCommit[];
}

const CommitsList = ({
  items,
  onPressItem,
  onLongPress,
  refreshControl,
  onRealEndReached,
  renderFooter,
  refreshing,
}: CommitsListProps) => {
  const [timeAgo] = useState(new TimeAgo("en-US"));

  const utcOffset: number = useMemo(() => moment().utcOffset(), []);

  const sections = useMemo(() => {
    const first_item = items[0];
    let before_date: string = first_item
      ? first_item.committed_date
      : moment().toString();

    let sections: CommitsSection[] = [];
    //TODO: improve
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (i == 0 || !compareDate(before_date, item.committed_date, utcOffset)) {
        sections.push({
          title: moment
            .parseZone(item.committed_date)
            .utcOffset(utcOffset)
            .format("MMM DD"),
          data: [item],
        });
      } else {
        sections[sections.length - 1].data.push(item);
      }
      before_date = item.committed_date;
    }
    return sections;
  }, [items]);

  const keyExtractor = useCallback(
    (item, index) => `row-commit-${item.id}`,
    []
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <CommitRow
        item={item}
        index={index}
        utcOffset={utcOffset}
        onPressItem={onPressItem}
        onLongPressItem={onLongPress}
        timeAgo={timeAgo}
      />
    ),
    [utcOffset, onPressItem, onLongPress, timeAgo]
  );

  const renderSectionHeader = useCallback(
    ({ section }) => <SectionListHeader title={section.title} />,
    []
  );

  return (
    <SectionList
      keyExtractor={keyExtractor}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshing={refreshing}
      refreshControl={refreshControl}
      onRealEndReached={onRealEndReached}
      ListFooterComponent={renderFooter}
    />
  );
};

export default React.memo(CommitsList);
