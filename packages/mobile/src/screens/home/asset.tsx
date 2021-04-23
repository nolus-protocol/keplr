import React, { FunctionComponent } from "react";

import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { View } from "react-native";
import { Text, Badge } from "react-native-elements";
import { DoughnutChart } from "../../components/svg";
import {
  fcSecondary,
  flex1,
  flexDirectionRow,
  ml2,
  mx2,
  sf,
  bgcSecondary,
  flexDirectionRowReverse,
  alignItemsCenter,
  fAlignRight,
  fcPrimary,
  mt4,
  relative,
  py4,
  absolute,
  justifyContentCenter,
  subtitle2,
  h3,
  mb1,
  subtitle1,
  body1,
} from "../../styles";

export const AssetView: FunctionComponent = observer(() => {
  const { chainStore, accountStore, queriesStore, priceStore } = useStore();

  const current = chainStore.current;

  const queries = queriesStore.get(current.chainId);

  const accountInfo = accountStore.getAccount(current.chainId);

  const balanceStakableQuery = queries
    .getQueryBalances()
    .getQueryBech32Address(accountInfo.bech32Address).stakable;

  const stakable = balanceStakableQuery.balance;

  const delegated = queries
    .getQueryDelegations()
    .getQueryBech32Address(accountInfo.bech32Address)
    .total.upperCase(true);

  const unbonding = queries
    .getQueryUnbondingDelegations()
    .getQueryBech32Address(accountInfo.bech32Address)
    .total.upperCase(true);

  const stakedSum = delegated.add(unbonding);

  const total = stakable.add(stakedSum);

  const fiatCurrency = "usd";

  const stakablePrice = priceStore.calculatePrice(fiatCurrency, stakable);
  const stakedSumPrice = priceStore.calculatePrice(fiatCurrency, stakedSum);

  const totalPrice = priceStore.calculatePrice(fiatCurrency, total);

  // If fiat value is fetched, show the value that is multiplied with amount and fiat value.
  // If not, just show the amount of asset.
  const data: number[] = [
    stakablePrice
      ? parseFloat(stakablePrice.toDec().toString())
      : parseFloat(stakable.toDec().toString()),
    stakedSumPrice
      ? parseFloat(stakedSumPrice.toDec().toString())
      : parseFloat(stakedSum.toDec().toString()),
  ];

  return (
    <View style={py4}>
      <View style={sf([relative, alignItemsCenter])}>
        <DoughnutChart data={data} />
        <View
          style={sf([
            absolute,
            alignItemsCenter,
            justifyContentCenter,
            {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          ])}
        >
          <Text style={sf([subtitle2, mb1])}>Total Balance</Text>
          <Text style={h3}>
            {totalPrice
              ? totalPrice.toString()
              : total.shrink(true).maxDecimals(6).toString()}
          </Text>
        </View>
      </View>
      <View style={mt4}>
        <View style={flexDirectionRow}>
          <View style={sf([flex1, flexDirectionRowReverse, alignItemsCenter])}>
            <Text style={sf([fAlignRight, fcPrimary, subtitle1, mx2])}>
              Available
            </Text>
            <Badge />
          </View>
          <View style={flex1}>
            <Text style={sf([body1, ml2])}>
              {stakable.locale(false).toString()}
            </Text>
          </View>
        </View>
        <View style={flexDirectionRow}>
          <View style={sf([flex1, flexDirectionRowReverse, alignItemsCenter])}>
            <Text style={sf([fAlignRight, fcSecondary, subtitle1, mx2])}>
              Staked
            </Text>
            <Badge badgeStyle={bgcSecondary} />
          </View>
          <View style={flex1}>
            <Text style={sf([body1, ml2])}>
              {stakedSum.locale(false).toString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});
