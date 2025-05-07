import { Box, Flex, SegmentedControl } from "@radix-ui/themes";
import { useState } from "react";
import { Slider } from "radix-ui";
import styles from "./filters.module.scss";

interface FiltersProps {
  onChange: (priceRange: number[], condition: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onChange }) => {
  const [value, setValue] = useState<Array<number>>([0, 10000]);
  const [condition, setCondition] = useState<string>("new");

  const handlePriceChange = (newValue: Array<number>) => {
    setValue(newValue);
    onChange(newValue, condition); // Обновляем фильтры
  };

  const handleConditionChange = (newCondition: string) => {
    setCondition(newCondition);
    onChange(value, newCondition);

    // Обновляем фильтры
  };

  return (
    <Flex direction="column" gap="5">
      <SegmentedControl.Root
        onValueChange={handleConditionChange}
        variant="surface"
        value={condition}
      >
        <SegmentedControl.Item value="new">Новое</SegmentedControl.Item>
        <SegmentedControl.Item value="old">Старое</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Box>
        <Slider.Root
          value={value}
          onValueChange={handlePriceChange}
          min={0}
          max={10000}
          step={1}
          aria-label="Диапазон цены"
          className={styles.sliderRoot}
        >
          <Slider.Track className={styles.sliderTrack}>
            <Slider.Range className={styles.sliderRange} />
          </Slider.Track>
          <Slider.Thumb className={styles.sliderThumb} />
          <Slider.Thumb className={styles.sliderThumb} />
        </Slider.Root>

        <div style={{ marginTop: 10 }}>
          <span>Цена: {value[0]}</span> ₽ - <span>{value[1]} ₽</span>
        </div>
      </Box>
    </Flex>
  );
};
