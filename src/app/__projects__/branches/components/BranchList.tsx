import React, { useCallback } from "react";
import BranchRow from "./BranchRow";
import EmptyState from "../../../../components/Commons/EmptyState";
import FlatList from "../../../../components/RN/FlatList";
import Spinner from "../../../../components/Commons/Spinner";
import { TBranch } from "../../../../core/gitlab/types/branches_types";

interface BranchListProps {
  items: TBranch[];
  onPressItem: any;
  onLongPressItem?;
  showSubtitle: boolean;
  refreshControl;
  selectedBranch?: string;
  showFooter: boolean;
  onRealEndReached: () => void;
}

const BranchList: React.FC<BranchListProps> = ({
  items,
  onPressItem,
  onLongPressItem,
  showSubtitle,
  refreshControl,
  selectedBranch,
  showFooter,
  onRealEndReached,
}) => {
  const keyExtractor = useCallback((item) => `row-${item.name}`, []);

  const renderItem = useCallback(
    ({ item }) => (
      <BranchRow
        item={item}
        showSubtitle={showSubtitle}
        onPressItem={onPressItem}
        onLongPressItem={onLongPressItem}
        selected={item.name == selectedBranch}
      />
    ),
    [showSubtitle, onPressItem, onLongPressItem, selectedBranch]
  );

  const renderFooter = useCallback(() => {
    if (showFooter) {
      return <Spinner />;
    } else {
      return null;
    }
  }, [showFooter]);

  return (
    <FlatList
      keyExtractor={keyExtractor}
      data={items}
      renderItem={renderItem}
      refreshControl={refreshControl}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={EmptyState}
      onRealEndReached={onRealEndReached}
    />
  );
};

export default BranchList;
