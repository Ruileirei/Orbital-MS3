import { Button, CheckBox } from '@rneui/themed';
import React, { useState } from 'react';
import { View } from 'react-native';

interface FilterDropdownProps {
    title: string;
    options: string[];
    selectedOptions: string[];
    onToggleOption: (option: string) => void;
    isSingleSelect?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    title,
    options,
    selectedOptions,
    onToggleOption,
    isSingleSelect
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={{ marginBottom: 12 }}>
            <Button
                title={isExpanded ? `▼ ${title}` : `▶ ${title}`}
                type="clear"
                onPress={() => setIsExpanded(prev => !prev)}
                titleStyle={{ fontSize: 16, fontWeight: '600', textAlign: 'left', color:'black'}}
                buttonStyle={{ alignItems: 'flex-start' }}
                containerStyle={{ alignItems: 'flex-start' }}
            />
            {isExpanded && options.map((option) => {
                const isChecked = selectedOptions.includes(option);
                return (
                    <CheckBox
                        key={option}
                        title={option}
                        checked={selectedOptions.includes(option)}
                        onPress={() => onToggleOption(option)}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                        checkedIcon={isSingleSelect ? 'dot-circle-o' : 'check-square-o'} 
                        uncheckedIcon={isSingleSelect ? 'circle-o' : 'square-o'}          
                        iconType="font-awesome"
                        checkedColor='black'
                        uncheckedColor='black'
                    />
                );
            })}
        </View>
    );
};

export default FilterDropdown;